import { Heading, Stack } from "@chakra-ui/react";
import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { LoaderFunction, useLoaderData } from "remix";
import { Messages } from "~/components/Messages";
import { UIForm } from "~/components/ui/UIForm";
import { initSettingsFlow } from "~/utils/settings-flow.server";

type LoaderData = SelfServiceSettingsFlow;

export const loader: LoaderFunction = async ({ request }) => {
  return initSettingsFlow({ request });
};

export default function ProfileSettings() {
  const data = useLoaderData<LoaderData>();

  return (
    <Stack>
      <Heading as="h1" size="lg">
        Profile Settings
      </Heading>
      <Messages messages={data.ui.messages} />
      <UIForm ui={data.ui} only={["profile"]} showEmpty />
    </Stack>
  );
}
