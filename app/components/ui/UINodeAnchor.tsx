import { Button } from "@chakra-ui/react";
import { UiNode, UiNodeAnchorAttributes } from "@ory/kratos-client";
import { Link } from "remix";
import { Messages } from "../Messages";

export function UINodeAnchor(
  props: { attributes: UiNodeAnchorAttributes } & UiNode
) {
  const { attributes, messages } = props;
  return (
    <Button
      as={(props) => (
        <>
          <a to={attributes.href} {...props}>
            {attributes.title.text}
          </a>
          <Messages messages={messages} />
        </>
      )}
    />
  );
}
