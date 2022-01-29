import { Button } from "@chakra-ui/react";
import { UiNode, UiNodeAnchorAttributes } from "@ory/kratos-client";
import { Link } from "remix";
import { Messages } from "../messages";

export function UINodeAnchor(
  props: { attributes: UiNodeAnchorAttributes } & UiNode
) {
  const { attributes, messages } = props;
  return (
    <Button
      as={(props) => (
        <>
          {props.to.startsWith("http") ? (
            <a href={props.to} {...props} />
          ) : (
            <Link to={attributes.href} {...props}>
              {attributes.title.text}
            </Link>
          )}
          <Messages messages={messages} />
        </>
      )}
    />
  );
}
