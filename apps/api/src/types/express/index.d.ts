// import { Request } from "express-serve-static-core";

declare module "express-serve-static-core" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Request {
    userId?: string;
  }
}

export {};
