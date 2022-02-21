import { cleanEnv, host, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  KRATOS_PUBLIC_URL: url({ devDefault: "http://localhost:4433" }),
  KRATOS_BROWSER_URL: url({ devDefault: "http://localhost:4433" }),
  HYDRA_ADMIN_URL: url({ devDefault: "http://localhost:4445" }),
  COOKIE_SECRET: str({ devDefault: "s3cret1" }),
  COOKIE_DOMAIN: host({ default: undefined }),
});
