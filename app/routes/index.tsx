import { LoaderFunction, redirect } from "remix";

export const loader: LoaderFunction = () => {
  return redirect("/welcome", { status: 303 });
};
