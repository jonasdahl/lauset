import { ComponentProps, ForwardedRef, forwardRef } from "react";
import { Link as RemixLink } from "remix";

export const Link = forwardRef<
  HTMLAnchorElement,
  ComponentProps<"a"> | ComponentProps<typeof RemixLink>
>((props, ref) => {
  if ("href" in props) {
    return <a href={props.href} ref={ref} {...props} />;
  } else if ("to" in props) {
    return <RemixLink ref={ref} {...props} />;
  } else {
    throw new Error("must specify either `href` or `to` in <Link />");
  }
});
