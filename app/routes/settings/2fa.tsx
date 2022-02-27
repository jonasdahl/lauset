import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { Messages } from "~/components/Messages";
import { UIForm } from "~/components/ui/UIForm";
import { commitSession, getSession } from "~/sessions";
import { getFlowOrRedirectToInit } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";

type LoaderData = SelfServiceSettingsFlow;

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.flash("settingsFlowRedirect", "/settings/2fa");
  const newCookie = await commitSession(session);

  return json<LoaderData>(
    await getFlowOrRedirectToInit(
      request,
      "settings",
      async (flow, cookie) => {
        return await kratosSdk.getSelfServiceSettingsFlow(
          flow,
          undefined,
          cookie
        );
      },
      new Headers({ "Set-Cookie": newCookie })
    ),
    { headers: { "Set-Cookie": newCookie } }
  );
};

export default function ProfileSettings() {
  const data = useLoaderData<LoaderData>();

  return (
    <Stack>
      <Heading as="h1" size="lg">
        Manage 2FA
      </Heading>
      <Messages messages={data.ui.messages} />
      <UIForm ui={data.ui} only={["totp"]} showEmpty />

      <Box h={6} />
      <UIForm
        ui={data.ui}
        only={["lookup_secret"]}
        before={
          <>
            <Heading as="h3" fontSize="xl">
              Manage 2FA Backup Recovery Codes
            </Heading>
            <Text>
              Recovery codes can be used in panic situations where you have lost
              access to your 2FA device.
            </Text>
          </>
        }
      />
    </Stack>
  );
}
