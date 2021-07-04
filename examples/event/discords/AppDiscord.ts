/* eslint-disable @typescript-eslint/no-unused-vars */
import { Discord, On, Client, ArgsOf } from "../../../src";

@Discord()
export abstract class AppDiscord {
  @On("messageCreate")
  onMessage([message]: ArgsOf<"messageCreate">, client: Client) {
    console.log(message.content);
  }
}
