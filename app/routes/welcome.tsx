import { Container, Heading, Stack } from "@chakra-ui/react";
import { LoaderFunction, Session, useLoaderData } from "remix";
import { LinkButton } from "~/components/link-button";
import { getSession } from "~/sessions";
import { kratosSdk } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie") ?? undefined
  const { logout_url } = await kratosSdk.createSelfServiceLogoutFlowUrlForBrowsers(cookie).then(r => r.data).catch(() => ({ logout_url: '' }))
  const session = await getSession(cookie)
  return { logout_url, session }
}

export default function Welcome() {
  const { login_url, session } = useLoaderData<{ login_url: string, session: Session }>()
  // TODO: ui
  return (
    <Container py={6}>
      <Stack>
        <Heading as="h1">Welcome!</Heading>
        <Stack>
          <LinkButton to="/login">Sign in</LinkButton>
          <LinkButton to="/sign-up">Sign up</LinkButton>
          <LinkButton to="/recover-account">Recover account</LinkButton>
          <LinkButton to="/verify-account">Verify account</LinkButton>
          <LinkButton to="/account-settings">Account settings</LinkButton>
          <LinkButton to="/logout">Logout</LinkButton>
        </Stack>
      </Stack>
    </Container>
  );
}
