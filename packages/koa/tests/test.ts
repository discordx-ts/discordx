import { Get, Koa, Middleware, Router } from "../build/cjs/index.js";
import { Next } from "koa";
import { RouterContext } from "@koa/router";

async function mdw1(ctx: RouterContext, next: Next) {
  console.log("I am mdw 1: start");
  await next();
  console.log("I am mdw 1: end\n\n");
}

async function mdw2(ctx: RouterContext, next: Next) {
  console.log("I am mdw 2: start");
  await next();
  console.log("I am mdw 2: end");
}

@Router()
@Middleware(mdw1)
export class Example {
  @Get("/")
  handle(ctx: RouterContext): void {
    ctx.body = "Hello world!";
  }

  @Get("/test")
  @Middleware(mdw2)
  handle2(ctx: RouterContext): void {
    ctx.body = "Hello world!";
  }
}

const server = new Koa();
server.build();

server.listen(3000, () => {
  console.log("server started...");
});
