import { Stack } from "@chakra-ui/react";
import {
  filterNodesByGroups,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui";
import { UiContainer, UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { UINodeAnchor } from "./UINodeAnchor";
import { UINodeImage } from "./UINodeImage";
import { UINodeInputButton } from "./UINodeInputButton";
import { UINodeInputCheckbox } from "./UINodeInputCheckbox";
import { UINodeInputDefault } from "./UINodeInputDefault";
import { UINodeInputHidden } from "./UINodeInputHidden";
import { UINodeScript } from "./UINodeScript";
import { UINodeText } from "./UINodeText";

export function UIForm({
  ui,
  only,
  before,
  after,
  showEmpty,
}: {
  ui: UiContainer;
  only?: string[];
  before?: JSX.Element;
  after?: JSX.Element;
  showEmpty?: boolean;
}) {
  const exists = filterNodesByGroups(ui.nodes, only, true).length > 0;
  if (!exists && !showEmpty) {
    return null;
  }

  return (
    <form action={ui.action} method={ui.method}>
      <Stack>
        {before}
        {filterNodesByGroups(ui.nodes, only).map((node) => (
          <UINode node={node} />
        ))}
        {after}
      </Stack>
    </form>
  );
}

function UINode({ node: { attributes, ...rest } }: { node: UiNode }) {
  if (isUiNodeAnchorAttributes(attributes)) {
    return (
      <UINodeAnchor key={attributes.id} attributes={attributes} {...rest} />
    );
  } else if (isUiNodeImageAttributes(attributes)) {
    return (
      <UINodeImage key={attributes.id} attributes={attributes} {...rest} />
    );
  } else if (isUiNodeInputAttributes(attributes)) {
    return (
      <UINodeInput key={attributes.name} attributes={attributes} {...rest} />
    );
  } else if (isUiNodeScriptAttributes(attributes)) {
    return (
      <UINodeScript key={attributes.id} attributes={attributes} {...rest} />
    );
  } else if (isUiNodeTextAttributes(attributes)) {
    return <UINodeText key={attributes.id} attributes={attributes} {...rest} />;
  }

  return <UINodeInputDefault attributes={attributes} {...rest} />;
}

function UINodeInput(props: { attributes: UiNodeInputAttributes } & UiNode) {
  const key = props.attributes.name;
  switch (props.attributes.type) {
    case "hidden":
      return <UINodeInputHidden key={key} {...props} />;
    case "submit":
      return <UINodeInputButton key={key} {...props} />;
    case "button":
      return <UINodeInputButton key={key} {...props} />;
    case "checkbox":
      return <UINodeInputCheckbox key={key} {...props} />;
    default:
      return <UINodeInputDefault key={key} {...props} />;
  }
}
