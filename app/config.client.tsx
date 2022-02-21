import { cleanEnv } from "envalid";

export const env = cleanEnv(
  {
    NODE_ENV: process.env.NODE_ENV,
  },
  {}
);
