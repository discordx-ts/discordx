/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Next, Server } from "@discordx/socket.io";
import { Guard, On, Ws } from "@discordx/socket.io";
import type { Socket } from "socket.io";

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
    arg4: unknown,
  ): void {
    console.log(message, typeof server, typeof socket, typeof arg4);
    server.emit("chat message", message);
  }
}
