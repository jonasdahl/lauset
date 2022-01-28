import { Button } from "@chakra-ui/react";
import { ComponentProps, forwardRef } from "react";
import { Link } from "remix";

export function UIScreenButton(
  props: ComponentProps<typeof Link> & ComponentProps<typeof Button>
) {
  return (
    <Button
      as={forwardRef((props, ref) => (
        <Link
          reloadDocument={props.to.startsWith("http")}
          {...props}
          ref={ref}
        />
      ))}
      {...props}
    />
  );
}
