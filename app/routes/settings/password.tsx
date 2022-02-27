import { Heading } from "@chakra-ui/react";
import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { UIForm } from "~/components/ui/UIForm";
import { commitSession, getSession } from "~/sessions";
import { getFlowOrRedirectToInit } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";

type LoaderData = SelfServiceSettingsFlow;

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.flash("settingsFlowRedirect", "/settings/password");
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
    <UIForm
      ui={data.ui}
      only={["password"]}
      before={
        <Heading as="h3" fontSize="xl">
          Change password
        </Heading>
      }
      showEmpty
    />
  );
}
