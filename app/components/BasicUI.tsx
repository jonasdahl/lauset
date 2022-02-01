import { Container, Heading, Stack } from "@chakra-ui/react";
import { UiContainer } from "@ory/kratos-client";
import { Messages } from "./Messages";
import { UIForm } from "./ui/UIForm";

export function BasicUI({
  ui,
  heading,
  footer,
}: {
  ui: UiContainer;
  heading: string;
  footer: JSX.Element;
}) {
  return (
    <Container py={7}>
      <Stack>
        <Heading as="h1">{heading}</Heading>
        <Messages messages={ui.messages} />
        <UIForm ui={ui} />
        {footer}
      </Stack>
    </Container>
  );
}
