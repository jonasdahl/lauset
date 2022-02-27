import { Box, Code, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { Session } from "@ory/kratos-client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { UIScreenButton } from "~/components/ui/UIScreenButton";
import { kratosSdk } from "~/utils/ory.server";

type LoaderData = { logoutUrl: string; userInfo: Session | null };

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie") ?? undefined;
  const { logout_url: logoutUrl } = await kratosSdk
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

  return json<LoaderData>({ logoutUrl, userInfo });
};

export default function Welcome() {
  const { logoutUrl, userInfo } = useLoaderData<LoaderData>();

  return (
    <Container py={6}>
      <Stack spacing={5}>
        <Heading as="h1">Welcome</Heading>

        <Stack>
          <Heading as="h2" size="md">
            Session Information
          </Heading>
          <Text>
            Below you will find the decoded Ory Session if you are logged in.
          </Text>
          <Code as="pre" p={4}>
            {JSON.stringify(userInfo, null, 2)}
          </Code>
        </Stack>

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
          <UIScreenButton href={logoutUrl} disabled={!userInfo}>
            Logout
          </UIScreenButton>
        </Stack>
      </Stack>
    </Container>
  );
}
