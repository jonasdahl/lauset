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

*/
