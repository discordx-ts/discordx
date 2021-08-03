import { CommandInteraction } from "discord.js";
import {
  Discord,
  Slash,
  SlashOption,
  Guild,
  Group,
  SlashChoices,
} from "../../../src";

enum TextChoices {
  Hello = "Hello",
  "Good Bye" = "GoodBye",
}

@Discord()
@Guild("693401527494377482")
@Group("testing", "Testing group description", {
  maths: "maths group description",
  text: "text group description",
})
export abstract class AppDiscord {
  @Slash("add")
  @Group("maths")
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  @Group("maths")
  multiply(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x * y));
  }

  @Slash("hello")
  @Group("text")
  hello(
    @SlashChoices(TextChoices)
    @SlashOption("text")
    text: TextChoices,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }

  @Slash("hello")
  root(
    @SlashOption("text")
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }
}

@Discord()
@Guild("693401527494377482")
export abstract class AppDiscord1 {
  @Slash("hello")
  add(
    @SlashOption("text")
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }
}
