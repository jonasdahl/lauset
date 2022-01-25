import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeTextAttributes } from "@ory/kratos-client";

export function UINodeText(
  props: { attributes: UiNodeTextAttributes } & UiNode
) {
  const { attributes } = props;
  return (
    <div>
      <p>{getNodeLabel(props)}</p>
      {attributes.text.id === 1050015 ? (
        <div className="container-fluid">
          <div className="row">
            {attributes.text.context?.secrets.map((secret) => (
              <div className="recovery-code">
                {secret.id === 1050014 ? (
                  <code>Used</code>
                ) : (
                  <code>{secret.text}</code>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <pre>
          <code>{attributes.text.text}</code>
        </pre>
      )}
    </div>
  );
}

/*
<div data-testid="node/text/{{attributes.id}}">
  <p style="margin-bottom: .5rem"
     data-testid="node/text/{{attributes.id}}/label"
     class="typography-paragraph">
    {{getNodeLabel .}}
  </p>
  {{#if (eq attributes.text.id 1050015)}}
    <!-- lookup_secret -->
    <div class="container-fluid"
         data-testid="node/text/{{attributes.id}}/text">
      <div class="row">
        {{#each attributes.text.context.secrets}}
          <!-- Used lookup_secret has ID 1050014 -->
          <div data-testid="node/text/{{attributes.id}}/lookup_secret"
               class="col-xs-3 recovery-code">
            {{#if (eq id 1050014)}}<code>Used</code>{{else}}<code>{{text}}</code>{{/if}}</div>
        {{/each}}
      </div>
      <!--Recovery Code-->
    </div>
  {{else}}
    <pre style="margin-top: 0"><code
      data-testid="node/text/{{attributes.id}}/text">{{attributes.text.text}}</code></pre>
  {{/if}}
</div>
*/
