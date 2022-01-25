import {
  Configuration as KratosConfiguration,
  V0alpha2Api,
} from "@ory/kratos-client";
import {
  AdminApi,
  Configuration as HydraConfiguration,
} from "@ory/hydra-client";

// Taken from https://github.com/ory/kratos-selfservice-ui-node/blob/29b716c0b866dd70c9f6d7db5aa79b33b0242947/src/pkg/sdk/index.ts
export const kratosPublicUrl = process.env.KRATOS_PUBLIC_URL!;
export const kratosBrowserUrl = process.env.KRATOS_BROWSER_URL!;

export const kratosSdk = new V0alpha2Api(
  new KratosConfiguration({
    basePath: kratosPublicUrl,
  })
);

export const hydraAdminUrl = process.env.HYDRA_ADMIN_URL!;
export const hydraAdmin = new AdminApi(
  new HydraConfiguration({
    basePath: hydraAdminUrl,
  })
);

// https://github.com/ory/kratos-selfservice-ui-node/blob/29b716c0b866dd70c9f6d7db5aa79b33b0242947/src/pkg/index.ts
export function getUrlForKratosFlow(
  base: string,
  flow: string,
  query?: URLSearchParams
) {
  return `${removeTrailingSlash(base)}/self-service/${flow}/browser${
    query ? `?${query.toString()}` : ""
  }`;
}

function removeTrailingSlash(s: string) {
  return s.replace(/\/$/, "");
}
