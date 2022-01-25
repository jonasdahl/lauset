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
import { Form, FormMethod } from "remix";
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
  const nodes = filterNodesByGroups(ui.nodes, only).map((node) => {
    const { attributes, ...rest } = node;
    if (isUiNodeAnchorAttributes(attributes)) {
      return <UINodeAnchor {...{ attributes, ...rest }} />;
    } else if (isUiNodeImageAttributes(attributes)) {
      return <UINodeImage {...{ attributes, ...rest }} />;
    } else if (isUiNodeInputAttributes(attributes)) {
      switch (attributes.type) {
        case "hidden":
          return <UINodeInputHidden {...{ attributes, ...rest }} />;
        case "submit":
          return <UINodeInputButton {...{ attributes, ...rest }} />;
        case "button":
          return <UINodeInputButton {...{ attributes, ...rest }} />;
        case "checkbox":
          return <UINodeInputCheckbox {...{ attributes, ...rest }} />;
        default:
          return <UINodeInputDefault {...{ attributes, ...rest }} />;
      }
    } else if (isUiNodeScriptAttributes(attributes)) {
      return <UINodeScript {...{ attributes, ...rest }} />;
    } else if (isUiNodeTextAttributes(attributes)) {
      return <UINodeText {...{ attributes, ...rest }} />;
    }

    return <UINodeInputDefault {...{ attributes, ...rest }} />;
  });

  if (nodes.length || showEmpty) {
    return (
      <Form action={ui.action} method={ui.method as FormMethod}>
        <Stack>
          {before}
          {nodes}
          {after}
        </Stack>
      </Form>
    );
  } else {
    return null;
  }
}
