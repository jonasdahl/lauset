import { LoaderFunction } from "remix";

export const loader: LoaderFunction = async () => {
  return new Response("ok", { status: 200 });
};
