import { SelfServiceVerificationFlow } from "@ory/kratos-client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { BasicUI } from "~/components/BasicUI";
import { getFlowOrRedirectToInit } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  return getFlowOrRedirectToInit(request, "verification", (flow, cookie) =>
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
