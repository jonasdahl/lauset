import { Container, Heading, Stack } from "@chakra-ui/react";
import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { LoaderFunction, useLoaderData } from "remix";
import { getUrlForKratosFlow, kratosBrowserUrl, kratosSdk } from "~/utils/ory.server";
import { getFlow, responseOnSoftError } from "~/utils/flow";

export const loader: LoaderFunction = async ({ request }) => {
  const [flow, response] = getFlow(request, "login")

  const register_url = getUrlForKratosFlow(
      kratosBrowserUrl,
      'registration',
      new URLSearchParams({
        return_to: (new URL(request.url).searchParams.get("return_to") ?? '').toString()
      })
    )

  const logout_url = await kratosSdk.createSelfServiceLogoutFlowUrlForBrowsers(request.headers.get("Cookie")!).then(r => r.data.logout_url).catch(() => '') ?? ''

  if(!flow) {
    return response
  } else {
    return kratosSdk.getSelfServiceRecoveryFlow(flow, request.headers.get("Cookie")!).then(r => ({login: r.data, register_url, logout_url})).catch(r => responseOnSoftError(r, response))
  }
}

type LoaderData = { login: SelfServiceLoginFlow, register_url: string, logout_url: string }

export default function Login() {

  const data = useLoaderData<LoaderData>()

  return (
    <Container>
      <Stack>
        <Heading as="h1">Login</Heading>
      </Stack>
    </Container>
  );
}
