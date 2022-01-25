import { Link } from ".pnpm/react-router-dom@6.2.1_react-dom@17.0.2+react@17.0.2/node_modules/react-router-dom";
import { SelfServiceVerificationFlow } from "@ory/kratos-client";
import { LoaderFunction, useLoaderData } from "remix";
import { BasicUI } from "~/components/BasicUI";
import { getQueryParameterFlow } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  return getQueryParameterFlow(request, "verification", (flow, cookie) =>
    kratosSdk.getSelfServiceVerificationFlow(flow, cookie)
  );
};

export default function Verification() {
  const data = useLoaderData<SelfServiceVerificationFlow>();
  return (
    <BasicUI
      ui={data.ui}
      heading="Verification"
      footer={<Link to="/">Go back</Link>}
    />
  );
}
