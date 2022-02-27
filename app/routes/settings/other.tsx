import { Heading, Stack, Text } from "@chakra-ui/react";
import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { LoaderFunction, useLoaderData } from "remix";
import { Messages } from "~/components/Messages";
import { UIForm } from "~/components/ui/UIForm";
import { initSettingsFlow } from "~/utils/settings-flow.server";

type LoaderData = SelfServiceSettingsFlow;

export const loader: LoaderFunction = async ({ request }) => {
  return initSettingsFlow({ request });
};

export default function OtherSettings() {
  const data = useLoaderData<LoaderData>();

  return (
    <Stack>
      <Messages messages={data.ui.messages} />

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
    </Stack>
  );
}
