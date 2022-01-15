import { Container, Heading, Stack } from "@chakra-ui/react";
import { LinkButton } from "~/components/link-button";

export default function Welcome() {
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
