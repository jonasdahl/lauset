import { Container, Heading, Stack } from "@chakra-ui/react";
import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { Messages } from "~/components/messages";
import { UIForm } from "~/components/ui/UIForm";
import { getQueryParameterFlow } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  return getQueryParameterFlow(request, "settings", (flow, cookie) =>
    kratosSdk.getSelfServiceSettingsFlow(flow, undefined, cookie)
  );
};

export default function Verification() {
  const data = useLoaderData<SelfServiceSettingsFlow>();

  return (
    <Container py={7}>
      <Stack>
        <Heading as="h1">Profile Management and Security Settings</Heading>
        <Messages messages={data.ui.messages} />

        <UIForm
          ui={data.ui}
          only={["profile"]}
          before={<Heading as="h3">Profile Settings</Heading>}
          showEmpty
        />

        <UIForm
          ui={data.ui}
          only={["password"]}
          before={<Heading as="h3">Change password</Heading>}
        />

        <UIForm
          ui={data.ui}
          only={["oidc"]}
          before={<Heading as="h3">Manage Social Sign In</Heading>}
        />

        <UIForm
          ui={data.ui}
          only={["lookup_secret"]}
          before={
            <>
              <Heading as="h3">Manage 2FA Backup Recovery Codes</Heading>
              <p>
                Recovery codes can be used in panic situations where you have
                lost access to your 2FA device.
              </p>
            </>
          }
        />

        <UIForm
          ui={data.ui}
          only={["totp"]}
          before={
            <>
              <Heading as="h3">Manage 2FA TOTP Authenticator App</Heading>
              <p>
                Add a TOTP Authenticator App to your account to improve your
                account security. Popular Authenticator Apps are{" "}
                <a href="https://www.lastpass.com" target="_blank">
                  LastPass
                </a>{" "}
                and Google Authenticator (
                <a
                  href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                  target="_blank"
                >
                  iOS
                </a>
                ,
                <a
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                  target="_blank"
                >
                  Android
                </a>
                ).
              </p>
            </>
          }
        />

        <UIForm
          ui={data.ui}
          only={["webauthn"]}
          before={
            <>
              <Heading as="h3">Manage Hardware Tokens and Biometrics</Heading>
              <p>
                Use Hardware Tokens (e.g. YubiKey) or Biometrics (e.g. FaceID,
                TouchID) to enhance your account security.
              </p>
            </>
          }
        />

        <Link to="/">Go back</Link>
      </Stack>
    </Container>
  );
}
