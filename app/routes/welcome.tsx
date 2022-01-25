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
  const { data: userInfo } = await kratosSdk.toSession(undefined, cookie);
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
          <UIScreenButton disabled={!userInfo} to="/login">
            Sign in
          </UIScreenButton>
          <UIScreenButton disabled={!userInfo} to="/sign-up">
            Sign up
          </UIScreenButton>
          <UIScreenButton disabled={!userInfo} to="/recover-account">
            Recover account
          </UIScreenButton>
          <UIScreenButton to="/verify-account">Verify account</UIScreenButton>
          <UIScreenButton disabled={!!userInfo} to="/account-settings">
            Account settings
          </UIScreenButton>
          <UIScreenButton disabled={!!userInfo} to={logout_url}>
            Logout
          </UIScreenButton>
        </Stack>
      </Stack>
    </Container>
  );
}
