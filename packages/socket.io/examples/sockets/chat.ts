import type { Socket } from "socket.io";

import type { Next, Server } from "../../build/cjs/index.js";
import { Guard, On, Ws } from "../../build/cjs/index.js";

@Ws()
export class Example {
  @On("chat message")
  @Guard(([message]: [string], server: Server, socket: Socket, next: Next) => {
    console.log(message, typeof server, typeof socket, typeof next);
    return next();
  })
  onChatMsg(
    [message]: [string],
    server: Server,
    socket: Socket,
    arg4: unknown
  ): void {
    console.log(message, typeof server, typeof socket, typeof arg4);
    server.emit("chat message", message);
  }
}
