import { Configuration, V0alpha2Api } from "@ory/client";
import {
  V0alpha2Api as OpenSourceV0alpha2Api,
  V0alpha2ApiInterface,
} from "@ory/kratos-client";

// Taken from https://github.com/ory/kratos-selfservice-ui-node/blob/29b716c0b866dd70c9f6d7db5aa79b33b0242947/src/pkg/sdk/index.ts
const apiBaseUrlInternal =
  process.env.KRATOS_PUBLIC_URL ||
  process.env.ORY_SDK_URL ||
  "https://playground.projects.oryapis.com";

export const apiBaseUrl = process.env.KRATOS_BROWSER_URL || apiBaseUrlInternal;

// Sets up the SDK using Ory Cloud
let sdk: V0alpha2ApiInterface = new V0alpha2Api(
  new Configuration({ basePath: apiBaseUrlInternal })
) as unknown as V0alpha2ApiInterface;

// Alternatively use the Ory Kratos SDK.
if (process.env.KRATOS_PUBLIC_URL) {
  sdk = new OpenSourceV0alpha2Api(
    new Configuration({ basePath: apiBaseUrlInternal })
  );
}

export const orySdk = sdk;

export function getUrlForFlow(flow: string, query?: URLSearchParams) {
  return `${removeTrailingSlash(apiBaseUrl)}/self-service/${flow}/browser${
    query ? `?${query.toString()}` : ""
  }`;
}

function removeTrailingSlash(s: string) {
  return s.replace(/\/$/, "");
}
