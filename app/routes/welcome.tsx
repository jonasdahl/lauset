import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Code,
  Container,
  Grid,
  GridItem,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  faRotate,
  faUser,
  faWallet,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Session } from "@ory/kratos-client";
import md5 from "md5";
import { forwardRef } from "react";
import { json, Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { UIScreenButton } from "~/components/ui/UIScreenButton";
import { kratosSdk } from "~/utils/ory.server";
import { getUserFullName } from "~/utils/user.server";

type LoaderData = {
  logoutUrl: string;
  userInfo: Session;
  gravatarHash: string | null;
  userId: string | null;
  userFullName: string;
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

  return json<LoaderData>({
    logoutUrl,
    userInfo,
    gravatarHash,
    userId,
    userFullName: await getUserFullName(userInfo),
  });
};

export default function Welcome() {
  const { logoutUrl, userInfo, gravatarHash, userId, userFullName } =
    useLoaderData<LoaderData>();

  return (
    <VStack spacing={5}>
      <Tooltip label="Change your avatar on gravatar.com">
        <Avatar
          src={
            gravatarHash
              ? `https://www.gravatar.com/avatar/${gravatarHash}.jpg`
              : undefined
          }
          size="xl"
        />
      </Tooltip>

      <Heading as="h1" color="white" textAlign="center" maxW="30rem">
        Welcome, {userFullName}
      </Heading>

      <Container
        maxW="container.lg"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="lg"
        boxShadow="lg"
        p={6}
      >
        <Stack spacing={5}>
          <Heading size="md">Account settings</Heading>
          <Grid templateColumns="repeat(3, 1fr)">
            <MenuItem
              icon={faUser}
              href="/settings/profile"
              label="User profile"
            />
            <MenuItem
              icon={faRotate}
              href="/settings/password"
              label="Change password"
            />
            <MenuItem icon={faWallet} href="/settings/2fa" label="Manage 2FA" />
          </Grid>
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
    </VStack>
  );
}

function MenuItem({
  icon,
  label,
  href,
}: {
  href: string;
  label: string;
  icon: IconDefinition;
}) {
  return (
    <GridItem>
      <LinkBox>
        <VStack textAlign="center">
          <Box fontSize="5xl">
            <FontAwesomeIcon icon={icon} />
          </Box>
          <LinkOverlay
            as={forwardRef((props, ref) => (
              <Link to={href} {...props} ref={ref as any} prefetch="intent" />
            ))}
          >
            {label}
          </LinkOverlay>
        </VStack>
      </LinkBox>
    </GridItem>
  );
}
