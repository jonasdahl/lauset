import { AcceptConsentRequest, RejectRequest } from "@ory/hydra-client";
import { Session } from "@ory/kratos-client";
import { ActionFunction, LoaderFunction, redirect } from "remix";
import { hydraAdmin } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams
  // Parses the URL query
  // The challenge is used to fetch information about the consent request from ORY Hydra.
  const challenge = params.get("consent_challenge")

  if (!challenge) {
    throw new Error('Expected consent_challenge to be set.')
  }

  const {data: body} = await hydraAdmin.getConsentRequest(challenge)

  // If a user has granted this application the requested scope, hydra will tell us to not show the UI.
  if (body.skip) {
    // You can apply logic here, for example grant another scope, or do whatever...

    // Now it's time to grant the consent request. You could also deny the request if something went terribly wrong
    const acceptConsentRequest = {} as AcceptConsentRequest

    // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
    // are requested accidentally.
    acceptConsentRequest.grant_scope = body.requested_scope

    // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
    acceptConsentRequest.grant_access_token_audience = body.requested_access_token_audience

    // The session allows us to set session data for id and access tokens. Let's add the email if it is included.
    acceptConsentRequest.session = createHydraSession(body.requested_scope, body.context as Session)

    // All we need to do now is to redirect the user back to hydra!
    const { data: { redirect_to }} = await hydraAdmin.acceptConsentRequest(challenge, acceptConsentRequest)
    return redirect(redirect_to)
  }

  // If consent can't be skipped we MUST show the consent UI.
  return {
    challenge: challenge,
    // We have a bunch of data available from the response, check out the API docs to find what these values mean
    // and what additional data you have available.
    requested_scope: body.requested_scope,
    user: body.subject,
    client: body.client,
  }

};


export const action: ActionFunction = async ({request}) => {
  const form = await request.formData()
  const challenge = form.get("challenge")?.toString()

  if(!challenge) {
    throw new Error("missing challenge in consent action")
  }

  // Let's see if the user decided to accept or reject the consent request..
  if (form.get("submit") !== 'Allow access') {
    // Looks like the consent request was denied by the user
    const rejectConsentRequest = {} as RejectRequest

    rejectConsentRequest.error = 'access_denied'
    rejectConsentRequest.error_description = 'The resource owner denied the request'

    const { data: {redirect_to}} = await hydraAdmin.rejectConsentRequest(challenge, rejectConsentRequest)
    return redirect(redirect_to)
  }

  let grantScope: any = form.get("grant_scope")
  console.debug(grantScope)
  if (!grantScope) {
    throw new Error("missing grant_scope in consent action")
  }
  if (!Array.isArray(grantScope)) {
    grantScope = [grantScope]
  }

  // Seems like the user authenticated! Let's tell hydra...
  const {data: body} = await hydraAdmin.getConsentRequest(challenge)

  const acceptConsentRequest = {} as AcceptConsentRequest
  // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
  // are requested accidentally.
  acceptConsentRequest.grant_scope = grantScope

  // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
  acceptConsentRequest.grant_access_token_audience =
    body.requested_access_token_audience

  // This tells hydra to remember this consent request and allow the same client to request the same
  // scopes from the same user, without showing the UI, in the future.
  acceptConsentRequest.remember = Boolean(form.get("remember"))

  // When this "remember" sesion expires, in seconds. Set this to 0 so it will never expire.
  acceptConsentRequest.remember_for = 3600

  // The session allows us to set session data for id and access tokens. Let's add the email if it is included.
  acceptConsentRequest.session = createHydraSession(body.requested_scope, body.context as Session)

  const {data: {redirect_to}} = await hydraAdmin.acceptConsentRequest(challenge, acceptConsentRequest)

  // All we need to do now is to redirect the user back to hydra!
  return redirect(redirect_to)
}

const createHydraSession = (
  requestedScope: string[] = [],
  context: Session
) => {
  const verifiableAddresses = context.identity.verifiable_addresses || []
  if (
    requestedScope.indexOf('email') === -1 ||
    verifiableAddresses.length === 0
  ) {
    return {}
  }

  return {
    // This data will be available when introspecting the token. Try to avoid sensitive information here,
    // unless you limit who can introspect tokens. (Therefore the scope-check above)
    // access_token: { foo: 'bar' },

    // This data will be available in the ID token.
    // Most services need email-addresses, so let's include that.
    id_token: {
      email: verifiableAddresses[0].value as Object, // FIXME Small typescript workaround caused by a bug in Go-swagger
    },
  }
}


export default function Consent() {
  return <></>
}
