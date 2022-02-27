import {
  Box,
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  Spacer,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { Link } from "~/components/Link";
import { json, LoaderFunction, redirect, useLoaderData } from "remix";
import { UIForm } from "~/components/ui/UIForm";
import { getFlowOrRedirectToInit } from "~/utils/flow";
import {
  getUrlForKratosFlow,
  kratosBrowserUrl,
  kratosSdk,
} from "~/utils/ory.server";
import { Messages } from "~/components/Messages";

type LoaderData = SelfServiceLoginFlow & {
  register_url: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const login = await getFlowOrRedirectToInit(
    request,
    "login",
    (flow, cookie) => kratosSdk.getSelfServiceLoginFlow(flow, cookie)
  );

  const return_to = (
    new URL(request.url).searchParams.get("return_to") ?? ""
  ).toString();

  const register_url = getUrlForKratosFlow(
    kratosBrowserUrl,
    "registration",
    new URLSearchParams({ return_to })
  );

  const isAuthenticated = login.refresh || login.requested_aal === "aal2";

  if (isAuthenticated) {
    throw redirect("/welcome");
  }

  return json<LoaderData>(
    {
      ...login,
      register_url,
    },
    { headers: { "Cache-Control": "max-age=10" } }
  );
};

export default function Login() {
  const data = useLoaderData<LoaderData>();

  return (
    <Box
      minH="100%"
      backgroundColor="#4158D0"
      backgroundImage="linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
      py={16}
    >
      <Container
        py={7}
        p={6}
        maxW="20rem"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Stack pt={3}>
          <Heading as="h1" size="lg">
            {data.refresh
              ? "Confirm Action"
              : data.requested_aal === "aal2"
              ? "Two-Factor Authentication"
              : "Sign In"}
          </Heading>

          <Messages
            messages={data.ui.messages}
            alertProps={{ fontSize: "xs" }}
          />

          <Box pb={3}>
            <UIForm ui={data.ui} />
          </Box>

          <Divider />

          <HStack>
            <Link fontSize="sm" opacity={0.8} href={data.register_url}>
              Sign up
            </Link>
            <Spacer />
            <Link fontSize="sm" opacity={0.8} to="/recovery">
              Recover lost credentials
            </Link>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}
