import { SelfServiceRecoveryFlow } from "@ory/kratos-client";
import { LoaderFunction, useLoaderData } from "remix"
import { kratosSdk } from "~/utils/ory.server";
import { getFlow, responseOnSoftError } from "~/utils/flow";

export const loader: LoaderFunction = async ({ request }) => {
  const [flow, response] = getFlow(request, "recovery")
  if(!flow) {
    return response
  } else {
    return kratosSdk.getSelfServiceRecoveryFlow(flow, request.headers.get("Cookie")!).then(r => r.data).catch(r => responseOnSoftError(r, response))
  }
}

export default function Recovery() {
  const data = useLoaderData<SelfServiceRecoveryFlow>()
  // TODO: ui
  return <></>
}
