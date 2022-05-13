import type KoaRouter from "@koa/router";

export enum RequestType {
  All,
  Delete,
  Get,
  Head,
  Link,
  Options,
  Patch,
  Put,
  Post,
  Unlink,
}

export type KoaClientOptions = {
  env?: string | undefined;
  globalMiddlewares?: KoaRouter.Middleware[];
  id?: string;
  keys?: string[] | undefined;
  maxIpsCount?: number | undefined;
  proxy?: boolean | undefined;
  proxyIpHeader?: string | undefined;
  subdomainOffset?: number | undefined;
};
