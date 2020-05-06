import { Discord, On, Client } from "../../../src";
import { Message } from "discord.js";

@Discord()
export abstract class AppDiscord {
  @On("message")
  onMessage(message: Message, client: Client) {
    console.log(message.content);
  }
}
