import { Image } from "@chakra-ui/react";
import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeImageAttributes } from "@ory/kratos-client";

export function UINodeImage(
  props: { attributes: UiNodeImageAttributes } & UiNode
) {
  const { attributes } = props;
  return (
    <Image
      src={attributes.src}
      width={attributes.width}
      height={attributes.height}
      alt={getNodeLabel(props)}
    />
  );
}
