import { Button } from "@chakra-ui/react";
import { ComponentProps, forwardRef } from "react";
import { Link } from "~/components/Link";

export function UIScreenButton(
  props: (ComponentProps<"a"> | ComponentProps<typeof Link>) &
    ComponentProps<typeof Button>
) {
  return (
    <Button
      as={forwardRef((props, ref) => (
        <Link ref={ref} {...props} />
      ))}
      {...props}
    />
  );
}
