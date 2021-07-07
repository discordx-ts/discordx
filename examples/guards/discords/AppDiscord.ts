import { CommandInteraction } from "discord.js";
import { Discord, On, Client, ArgsOf, Guard, Slash } from "../../../src";
import { NotBot } from "../guards/NotBot";

@Discord()
export abstract class AppDiscord {
  @On("messageCreate")
  @Guard(NotBot)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMessage([message]: ArgsOf<"messageCreate">, _client: Client) {
    console.log(message.content);
  }

  @Slash("hello")
  @Guard(NotBot)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hello(interaction: CommandInteraction, _client: Client) {
    console.log(interaction);
  }
}
