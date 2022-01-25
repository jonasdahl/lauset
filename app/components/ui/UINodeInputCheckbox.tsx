import { Input } from "@chakra-ui/react";
import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { Messages } from "../messages";

export function UINodeInputCheckbox(
  props: { attributes: UiNodeInputAttributes } & UiNode
) {
  const { attributes, messages } = props;
  return (
    <fieldset>
      <Input name={attributes.name} type="hidden" value="false" />
      <Input
        name={attributes.name}
        id={attributes.name}
        type={attributes.type}
        value="true"
        placeholder={getNodeLabel(props)}
        checked={(attributes as any).checked}
        disabled={attributes.disabled}
      />
      <label htmlFor={attributes.name}>
        <svg />
        <span>{getNodeLabel(props)}</span>
      </label>
      <Messages messages={messages} />
    </fieldset>
  );
}
