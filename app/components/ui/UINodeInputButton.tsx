import { Button } from "@chakra-ui/react";
import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { Messages } from "../messages";

export function UINodeInputButton(
  props: { attributes: UiNodeInputAttributes } & UiNode
) {
  const { attributes, messages } = props;
  return (
    <>
      <Button
        onclick={attributes.onclick}
        name={attributes.name}
        type={attributes.type as "button" | "submit" | "reset"}
        value={attributes.value}
        disabled={attributes.disabled}
      >
        {getNodeLabel(props)}
      </Button>
      <Messages messages={messages} />
    </>
  );
}
