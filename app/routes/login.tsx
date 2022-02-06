import { Center, Container, Heading, Stack } from "@chakra-ui/react";
import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { Link } from "~/components/Link";
import { LoaderFunction, useLoaderData } from "remix";
import { UIForm } from "~/components/ui/UIForm";
import { UIScreenButton } from "~/components/ui/UIScreenButton";
import { getFlowOrRedirectToInit } from "~/utils/flow";
import {
  getUrlForKratosFlow,
  kratosBrowserUrl,
  kratosSdk,
} from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  const login = await getFlowOrRedirectToInit(
    request,
    "login",
    (flow, cookie) => kratosSdk.getSelfServiceLoginFlow(flow, cookie)
  );

  const return_to = (
    new URL(request.url).searchParams.get("return_to") ?? ""
  ).toString();

  const register_url = getUrlForKratosFlow(
    kratosBrowserUrl,
    "registration",
    new URLSearchParams({ return_to })
  );

  const logout_url =
    (await kratosSdk
      .createSelfServiceLogoutFlowUrlForBrowsers(request.headers.get("Cookie")!)
      .then((r) => r.data.logout_url)
      .catch(() => "")) ?? "";

  return {
    ...login,
    isAuthenticated: login.refresh || login.requested_aal === "aal2",
    register_url,
    logout_url,
  };
};

type LoaderData = SelfServiceLoginFlow & {
  isAuthenticated: boolean;
  register_url: string;
  logout_url: string;
};

export default function Login() {
  const data = useLoaderData<LoaderData>();

  return (
    <Container py={7}>
      <Stack>
        <Heading as="h1">
          {data.refresh
            ? "Confirm Action"
            : data.requested_aal === "aal2"
            ? "Two-Factor Authentication"
            : "Sign In"}
        </Heading>

        <UIForm ui={data.ui} />

        {data.isAuthenticated ? (
          <Center>
            <Link href={data.logout_url}>Log out</Link>
          </Center>
        ) : (
          <Stack>
            <UIScreenButton to={data.register_url}>
              Create account
            </UIScreenButton>
            <UIScreenButton to="/recovery">Recover account</UIScreenButton>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
