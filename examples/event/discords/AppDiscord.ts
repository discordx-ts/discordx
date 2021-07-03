/* eslint-disable @typescript-eslint/no-unused-vars */
import { Discord, On, Client, ArgsOf } from "../../../src";

@Discord()
export abstract class AppDiscord {
  @On("message")
  onMessage([message]: ArgsOf<"message">, client: Client) {
    console.log(message.content);
  }
}
