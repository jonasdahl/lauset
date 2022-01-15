import { Button } from "@chakra-ui/react";
import { ComponentProps } from "react";
import { Link } from "remix";

export function LinkButton({
  to,
  ...props
}: { to: string } & ComponentProps<typeof Button>) {
  return <Button as={(props) => <Link to={to} {...props} />} {...props} />;
}
