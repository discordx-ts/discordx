/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Get, Koa, Middleware, Router } from "@discordx/koa";
import type { RouterContext } from "@koa/router";
import type { Next } from "koa";

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
  handle(ctx: RouterContext, next: Next, koa: Koa): Promise<Next> {
    console.log(ctx.URL.host, koa.api);
    ctx.body = "Hello world";
    return next();
  }

  @Get("/test")
  @Middleware(mdw2)
  handle2(ctx: RouterContext, next: Next): Promise<Next> {
    ctx.body = "Hello world! 2";
    return next();
  }
}

const server = new Koa();
server.build();

server.listen(3000, () => {
  console.log("server started...");
});
