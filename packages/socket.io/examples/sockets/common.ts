import { Guard, Next, On, Once, Server, Ws } from "../../build/cjs/index.js";
import { Socket } from "socket.io";

@Ws()
export class Example {
  @On("connection")
  @Guard((socket: Socket, server: Server, xsocket: unknown, next: Next) => {
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
