import { CommandInteraction } from "discord.js";
import {
  Discord,
  Slash,
  Option,
  Group,
} from "../../../src";

@Discord()
@Group(
  "testing",
  "Testing group description",
  {
    maths: "maths group description",
    text: "text group description"
  }
)
export abstract class AppDiscord {
  @Slash("add")
  @Group("maths")
  add(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  @Group("maths")
  multiply(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x * y));
  }

  @Slash("hello")
  @Group("text")
  hello(
    @Option("text")
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }

  @Slash("root")
  root(interaction: CommandInteraction) {
    interaction.reply("root");
  }
}
