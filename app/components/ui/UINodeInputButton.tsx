import { Button, Stack } from "@chakra-ui/react";
import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { Messages } from "../Messages";

export function UINodeInputButton(
  props: { attributes: UiNodeInputAttributes } & UiNode
) {
  const { attributes, messages } = props;
  if (attributes.onclick) {
    console.error(
      "button onclick string, what should i do with this?",
      attributes.onclick
    );
  }
  return (
    <Stack>
      <Button
        name={attributes.name}
        type={attributes.type as "button" | "submit" | "reset"}
        value={attributes.value}
        disabled={attributes.disabled}
      >
        {getNodeLabel(props)}
      </Button>
      <Messages messages={messages} />
    </Stack>
  );
}
