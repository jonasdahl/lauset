import { LoaderFunction, redirect } from "remix";
import { commitSession, getSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;

  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const newSession = await commitSession(session);

  const sessionRedirect = session.get("settingsFlowRedirect");
  if (sessionRedirect && params.get("flow")) {
    return redirect(`${sessionRedirect}?${params.toString()}`, {
      headers: { "Set-Cookie": newSession },
    });
  }

  return redirect("/welcome");
};
