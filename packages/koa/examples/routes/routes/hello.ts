import type { RouterContext } from "@koa/router";
import type { Next } from "koa";

import { Get, Middleware, Router } from "../../../src/index.js";

function Log(ctx: RouterContext, next: Next) {
  console.log(`request: ${ctx.URL}`);
  return next();
}

function Authenticated(ctx: RouterContext, next: Next) {
  if (Number("4") === 3) {
    return next();
  }

  ctx.body = "unauthorized required";
  // we are not returning next, to avoid further execution
  return;
}

@Router()
@Middleware(Log) // will execute for all sub routes
export class Example {
  @Get("/")
  hello(ctx: RouterContext): void {
    ctx.body = "Hello world!";
  }

  @Get("/auth")
  @Middleware(Authenticated)
  auth(ctx: RouterContext): void {
    ctx.body = "Hello world!";
  }
}
