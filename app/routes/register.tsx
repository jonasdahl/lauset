import { Link } from ".pnpm/react-router-dom@6.2.1_react-dom@17.0.2+react@17.0.2/node_modules/react-router-dom";
import { SelfServiceRegistrationFlow } from "@ory/client";
import { LoaderFunction, useLoaderData } from "remix";
import { BasicUI } from "~/components/BasicUI";
import { getQueryParameterFlow } from "~/utils/flow";
import { kratosSdk } from "~/utils/ory.server";

export const loader: LoaderFunction = async ({ request }) => {
  // TODO: generate login url with return_to (https://github.com/ory/kratos-selfservice-ui-node/blob/master/src/routes/registration.ts)
  return getQueryParameterFlow(request, "registration", (flow, cookie) =>
    kratosSdk.getSelfServiceRegistrationFlow(flow, cookie)
  );
};

export default function SignUp() {
  const flow = useLoaderData<SelfServiceRegistrationFlow>();
  return (
    <BasicUI
      heading="Create an account"
      ui={flow.ui}
      footer={<Link to="/login">Sign in</Link>}
    />
  );
}
