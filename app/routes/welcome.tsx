import { Container, Heading, Stack } from "@chakra-ui/react";
import { Session } from "@ory/kratos-client";
import { LoaderFunction, useLoaderData } from "remix";
// import { getSession } from "~/sessions";
import { UIScreenButton } from "~/components/ui/UIScreenButton";
import { kratosSdk } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie") ?? undefined;
  const { logout_url } = await kratosSdk
    .createSelfServiceLogoutFlowUrlForBrowsers(cookie)
    .then((r) => r.data)
    .catch(() => ({ logout_url: "" }));

  let userInfo: Session | null = null;
  if (cookie?.includes("session")) {
    const { data } = await kratosSdk.toSession(undefined, cookie).catch((e) => {
      console.debug("failed to get session", e);
      return { data: null };
    });

    userInfo = data;
  }
  // const session = await getSession(cookie)
  return { logout_url, userInfo };
};

export default function Welcome() {
  const { logout_url, userInfo } =
    useLoaderData<{ logout_url: string; userInfo: Session }>();
  // TODO: ui
  return (
    <Container py={6}>
      <Stack>
        <Heading as="h1">Welcome!</Heading>

        <div className="box">
          <h2 className="typography-h3">Session Information</h2>
          <p className="typography-paragraph">
            Below you will find the decoded Ory Session if you are logged in.
          </p>
          <pre className="code-box">
            <code>{JSON.stringify(userInfo, null, 2)}</code>
          </pre>
        </div>
        <Stack>
          <UIScreenButton to="/login" disabled={!!userInfo}>
            Sign in
          </UIScreenButton>
          <UIScreenButton to="/registration" disabled={!!userInfo}>
            Sign up
          </UIScreenButton>
          <UIScreenButton to="/recovery" disabled={!userInfo}>
            Recover account
          </UIScreenButton>
          <UIScreenButton to="/verification">Verify account</UIScreenButton>
          <UIScreenButton to="/settings" disabled={!userInfo}>
            Account settings
          </UIScreenButton>
          <UIScreenButton to={logout_url} disabled={!userInfo}>
            Logout
          </UIScreenButton>
        </Stack>
      </Stack>
    </Container>
  );
}
