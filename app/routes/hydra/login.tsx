import { AcceptLoginRequest } from "@ory/hydra-client";
import { LoaderFunction, redirect } from "remix";
import { getUrlForKratosFlow, hydraAdmin, kratosBrowserUrl, kratosSdk } from "~/utils/ory.server";
import crypto from "crypto"
import { commitSession, getSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams
  const hydraChallenge = params.get("login_challenge")

  if (!hydraChallenge) {
    throw new Error("Missing Hydra challenge. (query parameter login_challenge)")
  }

  const { data } = await hydraAdmin.getLoginRequest(hydraChallenge)
  if (data.skip) {
    // You can apply logic here, for example update the number of times the user logged in...
    // Now it's time to grant the login kratosRequest. You could also deny the kratosRequest if something went terribly wrong
    // (e.g. your arch-enemy logging in...)
    const acceptLoginRequest = {} as AcceptLoginRequest
    acceptLoginRequest.subject = String(data.subject)

    console.debug('Accepting ORY Hydra Login Request because skip is true', acceptLoginRequest)

    // All we need to do now is to redirect the user back to hydra!
    return hydraAdmin
      .acceptLoginRequest(hydraChallenge, acceptLoginRequest)
      .then(({ data: body }) => redirect(String(body.redirect_to)))
  }

  const hydraLoginState = params.get("hydra_login_state")
  if (!hydraLoginState) {
    console.debug('Redirecting to login page because hydra_login_state was not found in the HTTP URL query parameters.')
    return redirectToLogin(request)
  }

  const session = await getSession(request.headers.get("Cookie"))
  if (hydraLoginState !== session.get("hydraLoginState")) {
    console.debug('Redirecting to login page because login states do not match.')
    return redirectToLogin(request)
  }

  try {
    // We need to know who the user is for hydra
    const { data: userInfo } = await kratosSdk.toSession(undefined, request.headers.get("Cookie")!)
    // We need to get the email of the user. We don't want to do that via traits as
    // they are dynamic. They would be part of the PublicAPI. That's not true
    // for identity.addresses So let's get it via the AdmninAPI
    const subject = userInfo.identity.id

    // User is authenticated, accept the LoginRequest and tell Hydra
    let acceptLoginRequest: AcceptLoginRequest = {} as AcceptLoginRequest
    acceptLoginRequest.subject = subject
    acceptLoginRequest.context = userInfo

    // All we need to do now is to redirect the user back to hydra!
    const loginResponse = await hydraAdmin.acceptLoginRequest(hydraChallenge, acceptLoginRequest)
    return redirect(String(loginResponse.data.redirect_to))
  } catch (e: any) {
    if (e.response && e.response.status === 403) {
      return redirect(getUrlForKratosFlow(kratosBrowserUrl, 'login', new URLSearchParams({ aal: 'aal2' })))
    } else {
      return redirectToLogin(request)
    }
  }
};

async function redirectToLogin(request: Request) {
  const session = await getSession(request.headers.get("Cookie"))
  if (!session) {
    throw new Error("failed to get session")
  }

  // 3. Initiate login flow with ORY Kratos:
  //
  //   - `prompt=login` forces a new login from kratos regardless of browser sessions.
  //      This is important because we are letting Hydra handle sessions
  //   - `redirect_to` ensures that when we redirect back to this url,
  //      we will have both the initial ORY Hydra Login Challenge and the ORY Kratos Login Request ID in
  //      the URL query parameters.
  console.log(
    'Initiating ORY Kratos Login flow because neither a ORY Kratos Login Request nor a valid ORY Kratos Session was found.'
  )
  const state = crypto.randomBytes(48).toString('hex')

  session.set("hydraLoginState", state)

  const configBaseUrl =
    process.env.BASE_URL && process.env.BASE_URL != '/' ? process.env.BASE_URL : ''
  const baseUrl = configBaseUrl || `${new URL(request.url).protocol}://${request.headers.get("host")}`
  const returnTo = new URL(request.url, baseUrl)
  returnTo.searchParams.set('hydra_login_state', state)
  console.debug(`returnTo: "${returnTo.toString()}"`, returnTo)

  console.debug('new URL: ', [
    kratosBrowserUrl + '/self-service/login/browser',
    baseUrl,
  ])

  const redirectTo = new URL(
    kratosBrowserUrl + '/self-service/login/browser',
    baseUrl
  )
  redirectTo.searchParams.set('refresh', 'true')
  redirectTo.searchParams.set('return_to', returnTo.toString())

  console.debug(`redirectTo: "${redirectTo.toString()}"`, redirectTo)

  return redirect(redirectTo.toString(), {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  })
}
