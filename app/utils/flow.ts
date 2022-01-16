import { redirect } from "remix";
import { getUrlForKratosFlow, kratosBrowserUrl } from "./ory.server";

// TODO: https://github.com/ory/kratos-selfservice-ui-node/blob/153b6516497456b376ea5c24e6bfe023c965a982/src/pkg/middleware.ts

export function getFlow(request: Request, name: string): [string | null, Response] {
	const params = new URL(request.url).searchParams;
	const flow = params.get("flow");
	const return_to = params.get("return_to") ?? ''

	const initFlowUrl = getUrlForKratosFlow(
		kratosBrowserUrl,
		name,
		new URLSearchParams({ return_to: return_to.toString() })
	)

	if (!flow) {
		console.debug('No flow ID found in URL query initializing login flow', {params})
	}

	return [flow, redirect(initFlowUrl, 303)]
}


export function responseOnSoftError(err: Error & { response?: { status: number}} , response: Response) {
    if (!err.response) {
      throw err
    } else if (
      err.response.status === 404 ||
      err.response.status === 410 ||
      err.response.status === 403
    ) {
      return response
    } else {
    	throw err
    }
}
