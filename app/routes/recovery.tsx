import { Center } from "@chakra-ui/react";
import { SelfServiceRecoveryFlow } from "@ory/kratos-client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { BasicUI } from "~/components/BasicUI";
import { getFlowOrRedirectToInit } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  return getFlowOrRedirectToInit(request, "recovery", (flow, cookie) =>
    kratosSdk.getSelfServiceRecoveryFlow(flow, cookie)
  );
};

export default function Recovery() {
  const data = useLoaderData<SelfServiceRecoveryFlow>();
  return (
    <BasicUI
      ui={data.ui}
      heading="Recovery"
      footer={
        <Center>
          <Link reloadDocument to="/login">
            Go Back
          </Link>
        </Center>
      }
    />
  );
}
