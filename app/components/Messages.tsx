import { Code, ListItem, UnorderedList } from "@chakra-ui/react";
import { UiText } from "@ory/kratos-client";

export function Messages({ messages }: { messages?: UiText[] }) {
  if (!messages || !messages.length) return null;

  return (
    <UnorderedList>
      {messages?.map((m) => (
        <ListItem key={m.id} className="message">
          <details>
            <summary>{m.text}</summary>
            <Code>
              {/* TODO: remove this */}
              <pre>{JSON.stringify(m, null, 2)}</pre>
            </Code>
          </details>
        </ListItem>
      ))}
    </UnorderedList>
  );
}

/*
{
  "id": 1010004,
  "text": "Please complete the second authentication challenge.",
  "type": "info",
  "context": {}
}

{
  "id": 4000006,
  "text": "The provided credentials are invalid, check for spelling mistakes in your password or username, email address, or phone number.",
  "type": "error",
  "context": {}
}

{
  "id": 1010003,
  "text": "Please confirm this action by verifying that it is you.",
  "type": "info",
  "context": {}
}
*/
