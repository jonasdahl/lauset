import { ListItem, UnorderedList } from "@chakra-ui/react";
import { UiText } from "@ory/kratos-client";

export function Messages({ messages }: { messages?: UiText[] }) {
  if (!messages || !messages.length) return null;

  return (
    <UnorderedList>
      {messages?.map((m) => (
        <ListItem className="message">{m.text}</ListItem>
      ))}
    </UnorderedList>
  );
}

/*
<div class="messages {{className}}">
  {{~#each messages~}}
  <div class="message" data-testid="ui/message/{{id}}">{{ text }}</div>
  {{~/each~}}
</div>
*/
