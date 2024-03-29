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
import { LoginFlow } from "@ory/client";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { Link } from "~/components/Link";
import { Messages } from "~/components/Messages";
import { UIForm } from "~/components/ui/UIForm";
import { getFlowOrRedirectToInit } from "~/utils/flow";
import {
  getUrlForKratosFlow,
  kratosBrowserUrl,
  kratosFrontendApi,
} from "~/utils/ory.server";

type LoaderData = LoginFlow & {
  partiallyAuthenticated: boolean;
  registerUrl: string;
  logoutUrl: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const login = await getFlowOrRedirectToInit(
    request,
    "login",
    (id, cookie) => kratosFrontendApi.getLoginFlow({id, cookie})
  );

  const return_to = (
    new URL(request.url).searchParams.get("return_to") ?? ""
  ).toString();

  const registerUrl = getUrlForKratosFlow(
    kratosBrowserUrl,
    "registration",
    new URLSearchParams({ return_to })
  );

  const partiallyAuthenticated =
    login.refresh || login.requested_aal === "aal2";

  const logoutUrl =
    (await kratosFrontendApi
      .createBrowserLogoutFlow({cookie: request.headers.get("Cookie")!})
      .then((r) => r.data.logout_url)
      .catch(() => "")) ?? "";

  return json<LoaderData>(
    {
      ...login,
      partiallyAuthenticated,
      registerUrl,
      logoutUrl,
    }
    // { headers: { "Cache-Control": "max-age=5" } }
  );
};

export default function Login() {
  const data = useLoaderData<LoaderData>();

  return (
    <Container>
      <Stack spacing={5}>
        <Container
          py={7}
          p={6}
          bg={useColorModeValue("white", "gray.800")}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Stack>
            <Heading as="h1">
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
              <UIForm
                ui={data.ui}
                groups={[
                  "password",
                  "oidc",
                  "code",
                  "totp",
                  "lookup_secret",
                  "webauthn",
                ]}
              />
            </Box>

            <Divider />
          </Stack>
        </Container>

        {data.partiallyAuthenticated ? (
          <Center>
            <Link fontSize="sm" color="#fff" href={data.logoutUrl}>
              Log out
            </Link>
          </Center>
        ) : (
          <HStack>
            <Link fontSize="sm" color="#fff" href={data.registerUrl}>
              Sign up
            </Link>
            <Spacer />
            <Link fontSize="sm" color="#fff" href="/recovery">
              Recover lost credentials
            </Link>
          </HStack>
        )}
      </Stack>
    </Container>
  );
}
