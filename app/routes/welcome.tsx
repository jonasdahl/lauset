import { Box, Code, Container, Heading, Stack, Text } from "@chakra-ui/react";
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
    const { data } = await kratosSdk
      .toSession(undefined, cookie)
      .catch(() => ({ data: null }));
    userInfo = data;
  }

  return { logout_url, userInfo };
};

export default function Welcome() {
  const { logout_url, userInfo } =
    useLoaderData<{ logout_url: string; userInfo: Session }>();

  return (
    <Container py={6}>
      <Stack>
        <Heading as="h1">Welcome!</Heading>

        <Box py={3}>
          <Heading as="h2">Session Information</Heading>
          <Text>
            Below you will find the decoded Ory Session if you are logged in.
          </Text>

          <Code>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
          </Code>
        </Box>

        <Stack>
          <UIScreenButton href="/login" disabled={!!userInfo}>
            Sign in
          </UIScreenButton>
          <UIScreenButton href="/registration" disabled={!!userInfo}>
            Sign up
          </UIScreenButton>
          <UIScreenButton href="/recovery" disabled={!!userInfo}>
            Recover account
          </UIScreenButton>
          <UIScreenButton href="/verification">Verify account</UIScreenButton>
          <UIScreenButton href="/settings" disabled={!userInfo}>
            Account settings
          </UIScreenButton>
          <UIScreenButton href={logout_url} disabled={!userInfo}>
            Logout
          </UIScreenButton>
        </Stack>
      </Stack>
    </Container>
  );
}
