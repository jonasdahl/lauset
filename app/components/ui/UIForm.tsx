import { Stack } from "@chakra-ui/react";
import {
  filterNodesByGroups,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui";
import { UiContainer } from "@ory/kratos-client";
import { FormMethod } from "remix";
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

  const nodes = filterNodesByGroups(ui.nodes, only).map((node) => {
    const { attributes, ...rest } = node;
    if (isUiNodeAnchorAttributes(attributes)) {
      return (
        <UINodeAnchor key={attributes.id} attributes={attributes} {...rest} />
      );
    } else if (isUiNodeImageAttributes(attributes)) {
      return (
        <UINodeImage key={attributes.id} attributes={attributes} {...rest} />
      );
    } else if (isUiNodeInputAttributes(attributes)) {
      switch (attributes.type) {
        case "hidden":
          return (
            <UINodeInputHidden
              key={attributes.name}
              attributes={attributes}
              {...rest}
            />
          );
        case "submit":
          return (
            <UINodeInputButton
              key={attributes.name}
              attributes={attributes}
              {...rest}
            />
          );
        case "button":
          return (
            <UINodeInputButton
              key={attributes.name}
              attributes={attributes}
              {...rest}
            />
          );
        case "checkbox":
          return (
            <UINodeInputCheckbox
              key={attributes.name}
              attributes={attributes}
              {...rest}
            />
          );
        default:
          return (
            <UINodeInputDefault
              key={attributes.name}
              attributes={attributes}
              {...rest}
            />
          );
      }
    } else if (isUiNodeScriptAttributes(attributes)) {
      return (
        <UINodeScript key={attributes.id} attributes={attributes} {...rest} />
      );
    } else if (isUiNodeTextAttributes(attributes)) {
      return (
        <UINodeText key={attributes.id} attributes={attributes} {...rest} />
      );
    }

    return <UINodeInputDefault attributes={attributes} {...rest} />;
  });

  return (
    <form action={ui.action} method={ui.method as FormMethod}>
      <Stack>
        {before}
        {nodes}
        {after}
      </Stack>
    </form>
  );
}
