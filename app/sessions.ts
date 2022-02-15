import { createCookieSessionStorage } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "lauset_session",
      domain: process.env.COOKIE_DOMAIN,
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      sameSite: "strict",
      secrets: [process.env.COOKIE_SECRET ?? "s3cret1"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
