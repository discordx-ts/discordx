import { Client, Discord, On } from "../../../src/index.js";
import type { ArgsOf } from "../../../src/index.js";

@Discord()
export abstract class AppDiscord {
  @On("messageCreate")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMessage([message]: ArgsOf<"messageCreate">, client: Client): void {
    console.log(message.content);
  }
}
