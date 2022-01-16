import { Code } from "@chakra-ui/react";
import { SelfServiceError } from "@ory/kratos-client";
import { json, LoaderFunction, redirect, useLoaderData } from "remix";
import { kratosSdk } from "~/utils/ory.server";

type LoaderData = SelfServiceError;

export const loader: LoaderFunction = async ({ request }) => {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return redirect("/");
  }
  const error = await kratosSdk.getSelfServiceError(id);
  return json<LoaderData>(error.data, {
    status: error.status,
    statusText: error.statusText,
  });
};

export default function ErrorView() {
  const error = useLoaderData<LoaderData>();
  return (
    <Code>
      <pre>{JSON.stringify(error.error, null, 4)}</pre>
    </Code>
  );
}
