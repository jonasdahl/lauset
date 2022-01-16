import { createCookieSessionStorage } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "_lauset_session",

      // all of these are optional
      // domain: "remix.run",
      // expires: new Date(Date.now() + 60),
      // httpOnly: true,
      // maxAge: 60,
      // path: "/",
      // sameSite: "lax",
      // secrets: ["s3cret1"],
      // secure: true
    }
  });

export { getSession, commitSession, destroySession };
