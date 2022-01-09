import { Get, Middleware, Router } from "../../../build/cjs";
import { Next } from "koa";
import { RouterContext } from "@koa/router";

function Log(ctx: RouterContext, next: Next) {
  console.log("request: " + ctx.URL);
  return next();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Authenticated(ctx: RouterContext, next: Next) {
  ctx.body = "unauthorised required";
  // we are not returning next, to avoid further execution
  return;
}

@Router()
@Middleware(Log) // will execute for all sub routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class Example {
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
