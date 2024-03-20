/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Next, Server } from "@discordx/socket.io";
import { Guard, On, Once, Ws } from "@discordx/socket.io";
import type { Socket } from "socket.io";

@Ws()
export class Example {
  @On("connection")
  @Guard(([]: [Socket], server: Server, socket: unknown, next: Next) => {
    console.log("I am mdw");
    return next();
  })
  on(): void {
    console.log("I am @onx");
  }

  @On("disconnect")
  disconnect(): void {
    console.log("I am disconnect");
  }

  @Once("connection")
  once(): void {
    console.log("I am @Once");
  }
}
