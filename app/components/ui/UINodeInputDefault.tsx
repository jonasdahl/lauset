import { Input } from "@chakra-ui/react";
import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { Messages } from "../messages";

export function UINodeInputDefault(
  props: { attributes: UiNodeInputAttributes } & UiNode
) {
  const { attributes, messages } = props;
  return (
    <fieldset>
      <label>
        <span className="typography-h3">
          {getNodeLabel(props)}
          {attributes.required && "*"}
        </span>
        <Input
          name={attributes.name}
          id={attributes.name}
          type={attributes.type}
          value="true"
          placeholder={getNodeLabel(props)}
          disabled={attributes.disabled}
        />
      </label>
      <Messages messages={messages} />
    </fieldset>
  );
}
