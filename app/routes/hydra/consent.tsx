import { Container, Heading, Image, Stack } from "@chakra-ui/react";
import { OAuth2Client } from "@ory/hydra-client";
import { Session } from "@ory/kratos-client";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { hydraAdmin } from "~/utils/ory.server";

type ViewData = {
  challenge: string;
  requested_scope: string[];
  user: string;
  client: OAuth2Client;
};

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  // Parses the URL query
  // The challenge is used to fetch information about the consent request from ORY Hydra.
  const challenge = params.get("consent_challenge");

  if (!challenge) {
    throw new Error("Expected consent_challenge to be set.");
  }

  const { data: body } = await hydraAdmin.getConsentRequest(challenge);

  // If a user has granted this application the requested scope, hydra will tell us to not show the UI.
  if (body.skip) {
    // You can apply logic here, for example grant another scope, or do whatever...
    // All we need to do now is to redirect the user back to hydra!
    const {
      data: { redirect_to },
    } = await hydraAdmin.acceptConsentRequest(challenge, {
      // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
      // are requested accidentally.
      grant_scope: body.requested_scope,

      // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
      grant_access_token_audience: body.requested_access_token_audience,

      // The session allows us to set session data for id and access tokens. Let's add the email if it is included.
      session: createHydraSession(
        body.requested_scope,
        body.context as Session
      ),
    });
    return redirect(redirect_to);
  }

  // If consent can't be skipped we MUST show the consent UI.
  return {
    challenge: challenge,
    // We have a bunch of data available from the response, check out the API docs to find what these values mean
    // and what additional data you have available.
    requested_scope: body.requested_scope,
    user: body.subject,
    client: body.client,
  } as ViewData;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const challenge = form.get("challenge")?.toString();

  if (!challenge) {
    throw new Error("missing challenge in consent action");
  }

  // Let's see if the user decided to accept or reject the consent request..
  if (form.get("submit") !== "Allow access") {
    // Looks like the consent request was denied by the user
    const {
      data: { redirect_to },
    } = await hydraAdmin.rejectConsentRequest(challenge, {
      error: "access_denied",
      error_description: "The resource owner denied the request",
    });
    return redirect(redirect_to);
  }

  let grantScope = form.getAll("grant_scope") as string[] | null;
  if (!grantScope || grantScope.length === 0) {
    throw new Error("missing grant_scope in consent action");
  }

  // Seems like the user authenticated! Let's tell hydra...
  const { data: body } = await hydraAdmin.getConsentRequest(challenge);

  const {
    data: { redirect_to },
  } = await hydraAdmin.acceptConsentRequest(challenge, {
    // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
    // are requested accidentally.
    grant_scope: grantScope,

    // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
    grant_access_token_audience: body.requested_access_token_audience,

    // This tells hydra to remember this consent request and allow the same client to request the same
    // scopes from the same user, without showing the UI, in the future.
    remember: Boolean(form.get("remember")),

    // When this "remember" sesion expires, in seconds. Set this to 0 so it will never expire.
    remember_for: 3600,

    // The session allows us to set session data for id and access tokens. Let's add the email if it is included.
    session: createHydraSession(body.requested_scope, body.context as Session),
  });

  // All we need to do now is to redirect the user back to hydra!
  return redirect(redirect_to);
};

/*
{
  id: '41398353-419f-4bb9-b2c2-e2a06c51124d',
  active: true,
  expires_at: '2022-01-29T21:05:35.402963711Z',
  authenticated_at: '2022-01-28T21:05:35.402963711Z',
  authenticator_assurance_level: 'aal1',
  authentication_methods: [
    {
      method: 'password',
      completed_at: '2022-01-28T20:53:00.664152109Z'
    },
    {
      method: 'password',
      completed_at: '2022-01-28T21:05:35.402961808Z'
    }
  ],
  issued_at: '2022-01-28T21:05:35.402963711Z',
  identity: {
    id: 'ccb7f3ad-6547-4e9a-be44-08be31c279c0',
    schema_id: 'default',
    schema_url: 'http://localhost:4433/schemas/default',
    state: 'active',
    state_changed_at: '2022-01-28T18:15:47.82151471Z',
    traits: { email: 'andreas@addem.se', name: [Object] },
    verifiable_addresses: [ {
      id: 'c17a9686-bebf-4df2-ba87-5d6acc9424a7',
      value: 'andreas@addem.se',
      verified: true,
      via: 'email',
      status: 'completed',
      verified_at: '2022-01-28T18:16:11.354904678Z',
      created_at: '2022-01-28T18:15:47.823652Z',
      updated_at: '2022-01-28T18:15:47.823652Z'
    } ],
    recovery_addresses: [ [Object] ],
    created_at: '2022-01-28T18:15:47.82292Z',
    updated_at: '2022-01-28T18:15:47.82292Z'
  }
}
*/

const createHydraSession = (
  requestedScope: string[] = [],
  context: Session
) => {
  const verifiableAddresses = context.identity.verifiable_addresses || [];
  if (
    requestedScope.indexOf("email") === -1 ||
    verifiableAddresses.length === 0
  ) {
    return {
      id_token: {},
    };
  }

  console.debug("existing");
  return {
    // This data will be available when introspecting the token. Try to avoid sensitive information here,
    // unless you limit who can introspect tokens. (Therefore the scope-check above)
    // access_token: { foo: 'bar' },

    // This data will be available in the ID token.
    // Most services need email-addresses, so let's include that.
    id_token: {
      email: verifiableAddresses[0].value,
    },
  };
};

export default function Consent() {
  const { challenge, client, user, requested_scope } =
    useLoaderData<ViewData>();
  return (
    <Container>
      <Stack>
        <Heading>An application requests access to your data!</Heading>
        <Form action="/hydra/consent" method="post">
          <input type="hidden" name="challenge" value={challenge} />
          {client.logo_uri && <Image src={client.logo_uri} />}
          <p>
            Hi {user}, application{" "}
            <strong>{client.client_name ?? client.client_id}</strong> wants
            access resources on your behalf and to:
          </p>
          {requested_scope.map((scope) => (
            <div key={scope}>
              <input
                type="checkbox"
                name="grant_scope"
                id={scope}
                value={scope}
              />
              <label htmlFor={scope}>{scope}</label>
              <br />
            </div>
          ))}

          <p>
            Do you want to be asked next time when this application wants to
            access your data? The application will not be able to ask for more
            permissions without your consent.
          </p>

          <ul>
            {client.policy_uri && (
              <li>
                <a href={client.policy_uri}>Policy</a>
              </li>
            )}
            {client.tos_uri && (
              <li>
                <a href={client.tos_uri}>Terms of Service</a>
              </li>
            )}
          </ul>

          <p>
            <input type="checkbox" name="remember" id="remember" value="1" />
            <label htmlFor="remember">Do not ask me again</label>

            <input
              type="submit"
              name="submit"
              id="accept"
              value="Allow access"
            />
            <input
              type="submit"
              name="submit"
              id="reject"
              value="Deny access"
            />
          </p>
        </Form>
      </Stack>
    </Container>
  );
}
