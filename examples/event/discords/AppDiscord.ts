import { ArgsOf, Client, Discord, On } from "../../../src";

@Discord()
export abstract class AppDiscord {
  @On("messageCreate")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMessage([message]: ArgsOf<"messageCreate">, client: Client): void {
    console.log(message.content);
  }
}
