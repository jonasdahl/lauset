import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Center,
  Code,
  Collapse,
  Container,
  Heading,
  HStack,
  Image,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Session } from "@ory/kratos-client";
import md5 from "md5";
import { json, LoaderFunction, redirect, useLoaderData } from "remix";
import { UIScreenButton } from "~/components/ui/UIScreenButton";
import { kratosSdk } from "~/utils/ory.server";

type LoaderData = {
  logoutUrl: string;
  userInfo: Session;
  gravatarHash: string | null;
  userId: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("cookie") ?? undefined;
  const { logout_url: logoutUrl } = await kratosSdk
    .createSelfServiceLogoutFlowUrlForBrowsers(cookie)
    .then((r) => r.data)
    .catch(() => ({ logout_url: "" }));

  let userInfo: Session | null = null;
  if (cookie?.includes("session")) {
    const { data } = await kratosSdk
      .toSession(undefined, cookie)
      .catch(() => ({ data: null }));
    userInfo = data;
  }

  if (!userInfo) {
    throw redirect(logoutUrl);
  }

  const userId = userInfo.identity.verifiable_addresses?.[0]?.value ?? null;
  const gravatarHash = userId ? md5(userId.toLowerCase()) : null;

  return json<LoaderData>({ logoutUrl, userInfo, gravatarHash, userId });
};

export default function Welcome() {
  const { logoutUrl, userInfo, gravatarHash, userId } =
    useLoaderData<LoaderData>();

  return (
    <Container py={6}>
      <Stack spacing={5}>
        <HStack>
          <Heading as="h1">Welcome</Heading>
          <Spacer />

          <Box>{userId}</Box>
          {gravatarHash ? (
            <Avatar
              src={
                gravatarHash
                  ? `https://www.gravatar.com/avatar/${gravatarHash}.jpg`
                  : undefined
              }
            />
          ) : null}
        </HStack>

        <Stack>
          <UIScreenButton href="/settings">Account settings</UIScreenButton>
          <UIScreenButton href="/verification">Verify account</UIScreenButton>
          <UIScreenButton href={logoutUrl}>Logout</UIScreenButton>

          <Accordion allowMultiple>
            <AccordionItem border="none">
              <AccordionButton as={Button}>
                <h2>
                  <AccordionIcon /> Session information
                </h2>
              </AccordionButton>
              <AccordionPanel>
                <Code as="pre" p={4}>
                  {JSON.stringify(userInfo, null, 2)}
                </Code>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </Stack>
    </Container>
  );
}
