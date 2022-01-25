import { Input } from "@chakra-ui/react";
import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";

export function UINodeInputPassword(
  props: { attributes: UiNodeInputAttributes } & UiNode
) {
  const { attributes, messages } = props;
  return (
    <fieldset>
      <label>
        <Input
          onclick={attributes.onclick}
          name={attributes.name}
          id={attributes.name}
          type={attributes.type}
          value={attributes.value}
          placeholder={getNodeLabel(props)}
          disabled={attributes.disabled}
        />
        <span className="typography-h3">{getNodeLabel(props)}</span>
        {/*<UINodeInputPasswordToggle />*/}
      </label>
      {messages.map((t) => t.text)}
    </fieldset>
  );
}
