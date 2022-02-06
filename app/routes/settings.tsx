import { Center, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { Messages } from "~/components/Messages";
import { UIForm } from "~/components/ui/UIForm";
import { getFlowOrRedirectToInit } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  return getFlowOrRedirectToInit(request, "settings", (flow, cookie) =>
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
          before={
            <Heading as="h3" fontSize="xl">
              Profile Settings
            </Heading>
          }
          showEmpty
        />

        <UIForm
          ui={data.ui}
          only={["password"]}
          before={
            <Heading as="h3" fontSize="xl">
              Change password
            </Heading>
          }
        />

        <UIForm
          ui={data.ui}
          only={["oidc"]}
          before={
            <Heading as="h3" fontSize="xl">
              Manage Social Sign In
            </Heading>
          }
        />

        <UIForm
          ui={data.ui}
          only={["lookup_secret"]}
          before={
            <>
              <Heading as="h3" fontSize="xl">
                Manage 2FA Backup Recovery Codes
              </Heading>
              <Text>
                Recovery codes can be used in panic situations where you have
                lost access to your 2FA device.
              </Text>
            </>
          }
        />

        <UIForm
          ui={data.ui}
          only={["totp"]}
          before={
            <>
              <Heading as="h3" fontSize="xl">
                Manage 2FA TOTP Authenticator App
              </Heading>
              <Text>
                Add a TOTP Authenticator App to your account to improve your
                account security. Popular Authenticator Apps are{" "}
                <Link to="https://www.lastpass.com" target="_blank">
                  LastPass
                </Link>{" "}
                and Google Authenticator (
                <Link
                  to="https://apps.apple.com/us/app/google-authenticator/id388497605"
                  target="_blank"
                >
                  iOS
                </Link>
                ,
                <Link
                  to="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                  target="_blank"
                >
                  Android
                </Link>
                ).
              </Text>
            </>
          }
        />

        <UIForm
          ui={data.ui}
          only={["webauthn"]}
          before={
            <>
              <Heading as="h3" fontSize="xl">
                Manage Hardware Tokens and Biometrics
              </Heading>
              <Text>
                Use Hardware Tokens (e.g. YubiKey) or Biometrics (e.g. FaceID,
                TouchID) to enhance your account security.
              </Text>
            </>
          }
        />

        <Center>
          <Link to="/">Go back</Link>
        </Center>
      </Stack>
    </Container>
  );
}
