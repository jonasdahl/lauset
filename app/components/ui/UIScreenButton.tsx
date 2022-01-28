import { Button } from "@chakra-ui/react";
import { ComponentProps, forwardRef } from "react";
import { Link } from "remix";

export function UIScreenButton(
  props: ComponentProps<typeof Link> & ComponentProps<typeof Button>
) {
  return (
    <Button
      as={forwardRef((props, ref) =>
        props.to.startsWith("http") ? (
          <a {...props} ref={ref} />
        ) : (
          <Link {...props} ref={ref} />
        )
      )}
      {...props}
    />
  );
}
