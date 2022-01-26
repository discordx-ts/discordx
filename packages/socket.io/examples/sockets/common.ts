import type { Socket } from "socket.io";

import type { Next, Server } from "../../build/cjs/index.js";
import { Guard, On, Once, Ws } from "../../build/cjs/index.js";

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
