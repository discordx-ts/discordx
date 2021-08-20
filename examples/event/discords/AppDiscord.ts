/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgsOf, Client, Discord, On } from "../../../src";

@Discord()
export abstract class AppDiscord {
  @On("messageCreate")
  onMessage([message]: ArgsOf<"messageCreate">, client: Client): void {
    console.log(message.content);
  }
}
