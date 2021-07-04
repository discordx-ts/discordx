import { CommandInteraction } from "discord.js";
import { Discord, On, Client, ArgsOf, Guard, Slash } from "../../../src";
import { Say } from "../guards/Say";

@Discord()
export abstract class AppDiscord {
  @On("messageCreate")
  @Guard(Say("hello"))
  onMessage([message]: ArgsOf<"messageCreate">, client: Client) {
    console.log(message.content);
  }

  @Slash("hello")
  @Guard(Say("hello"))
  hello(interaction: CommandInteraction, client: Client) {
    console.log(interaction);
  }
}
