import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { LoaderFunction, useLoaderData } from "remix"
import { getFlow, responseOnSoftError } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";


export const loader: LoaderFunction = async ({ request }) => {
	const [flow, response] = getFlow(request, "settings")
	if(!flow) {
		return response
	} else {
		return kratosSdk.getSelfServiceSettingsFlow(flow, undefined, request.headers.get("Cookie")!).then(r => r.data).catch(r => responseOnSoftError(r, response))
	}
}

export default function Verification() {
	const data = useLoaderData<SelfServiceSettingsFlow>()
	// TODO: ui
	return <></>
}
