import { SelfServiceVerificationFlow } from "@ory/kratos-client";
import { LoaderFunction, redirect, useLoaderData } from "remix"
import { getUrlForKratosFlow, kratosBrowserUrl, kratosSdk } from "~/utils/ory.server";
import { getFlow, responseOnSoftError } from "~/utils/flow";

export const loader: LoaderFunction = async ({ request }) => {
  const [flow, response] = getFlow(request, "verification")
  if(!flow) {
    return response
  } else {
    return kratosSdk.getSelfServiceVerificationFlow(flow, request.headers.get("Cookie")!).then(r => r.data).catch(r => responseOnSoftError(r, response))
  }
}

export default function Verification() {
  const data = useLoaderData<SelfServiceVerificationFlow>()
  // TODO: ui
  return <></>
}
