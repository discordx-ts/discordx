import { On, Server, Ws } from "../../build/cjs/index.js";

@Ws()
export class Example {
  @On("chat message")
  onChatMsg(message: string, server: Server): void {
    server.emit("chat message", message);
  }
}
