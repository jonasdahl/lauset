import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
import {
  SelfServiceRegistrationFlow,
  UiNode,
  UiNodeInputAttributes,
} from "@ory/client";
import { UiNodeMeta, UiText } from "@ory/kratos-client";
import { json, LoaderFunction, redirect, useLoaderData } from "remix";
import { getUrlForFlow, orySdk } from "~/utils/ory.server";

type LoaderData = { flow: SelfServiceRegistrationFlow };

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const flow = params.get("flow");
  console.log({ flow });
  if (!flow) {
    return redirect(
      getUrlForFlow(
        "registration",
        new URLSearchParams({
          return_to: "", // "http://localhost:3000/sign-up"
        })
      ),
      { status: 303 }
    );
  }
  const { data, headers } = await orySdk.getSelfServiceRegistrationFlow(
    flow,
    request.headers.get("Cookie") ?? undefined
  );
  return json<LoaderData>({ flow: data }, { headers });
};

export default function SignUp() {
  const { flow } = useLoaderData<LoaderData>();
  console.log(flow);
  return (
    <Container py={7}>
      <Stack>
        <Heading as="h1">Create an account</Heading>
        <form method={flow.ui.method} action={flow.ui.action}>
          <Stack>
            {flow.ui.messages?.length ? (
              <Alert status="error">
                <UnorderedList>
                  {flow.ui.messages.map((message) => (
                    <ListItem key={message.id}>{message.text}</ListItem>
                  ))}
                </UnorderedList>
              </Alert>
            ) : null}

            {flow.ui.nodes.map((node, i) => {
              return <Node key={i} node={node} />;
            })}
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}

function Node({ node }: { node: UiNode }) {
  if (node.type === "input") {
    return (
      <InputNode
        group={node.group}
        attributes={node.attributes as UiNodeInputAttributes}
        messages={node.messages}
        meta={node.meta}
      />
    );
  }
  console.log(node);
  return (
    <Alert status="error">
      <AlertTitle>Don't know how to render node.</AlertTitle>
    </Alert>
  );
}

function InputNode({
  group,
  attributes,
  messages,
  meta,
}: {
  group: string;
  attributes: UiNodeInputAttributes;
  messages: UiText[];
  meta: UiNodeMeta;
}) {
  if (attributes.type === "hidden") {
    console.log({ group, attributes, messages, meta });
    return (
      <input type="hidden" name={attributes.name} value={attributes.value} />
    );
  }
  if (attributes.type === "submit") {
    return (
      <Stack>
        <Box>
          <input
            type="hidden"
            name={attributes.name}
            value={attributes.value}
          />
          <Button
            type="submit"
            disabled={attributes.disabled}
            colorScheme="green"
          >
            {meta.label?.text ?? "Submit"}
          </Button>
        </Box>
        {messages?.length ? (
          <Alert status="error">
            <UnorderedList>
              {messages.map((message) => (
                <ListItem key={message.id}>{message.text}</ListItem>
              ))}
            </UnorderedList>
          </Alert>
        ) : null}
      </Stack>
    );
  }
  if (
    attributes.type === "text" ||
    attributes.type === "email" ||
    attributes.type === "password"
  ) {
    return (
      <FormControl isInvalid={!!messages.length}>
        {meta.label ? <FormLabel>{meta.label.text}</FormLabel> : null}
        <Input
          type={attributes.type}
          name={attributes.name}
          disabled={attributes.disabled}
          required={attributes.required}
          pattern={attributes.pattern}
        />
        {messages.length ? (
          <FormErrorMessage>
            <UnorderedList>
              {messages.map((message) => (
                <ListItem key={message.id}>{message.text}</ListItem>
              ))}
            </UnorderedList>
          </FormErrorMessage>
        ) : null}
      </FormControl>
    );
  }
  console.log({ group, attributes, messages, meta });
  return <></>;
}
