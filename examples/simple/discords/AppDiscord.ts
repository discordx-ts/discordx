import { CommandInteraction, Permissions } from "discord.js";
import {
  Discord,
  On,
  Client,
  ArgsOf,
  Slash,
  Option,
  Choice,
  Permission,
} from "../../../src";

@Discord()
export abstract class AppDiscord {
  @On("message")
  onMessage([message]: ArgsOf<"message">, client: Client) {
    console.log(message.content);
  }

  @Slash("hello")
  hello(
    @Option("message", { description: "Say hello" })
    message: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(message);
  }

  @Slash("add")
  add(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }

  @Slash("iam")
  owner(
    @Choice("Human", "human")
    @Choice("Astraunot", "asto")
    @Choice("Dev", "dev")
    @Option("what", { description: "what are you" })
    what: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(what);
  }
}
