import {
  Discord,
  Slash,
  SlashChoice,
  SlashGroup,
  SlashOption,
} from "../../../src";
import { CommandInteraction } from "discord.js";

enum TextChoices {
  Hello = "Hello",
  "Good Bye" = "GoodBye",
}

@Discord()
@SlashGroup("testing", "Testing group description", {
  maths: "maths group description",
  text: "text group description",
})
export abstract class AppDiscord {
  @Slash("add")
  @SlashGroup("maths")
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  @SlashGroup("maths")
  multiply(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x * y));
  }

  @Slash("hello")
  @SlashGroup("text")
  hello(
    @SlashChoice(TextChoices)
    @SlashOption("text")
    text: TextChoices,
    interaction: CommandInteraction
  ): void {
    interaction.reply(text);
  }

  @Slash("hello")
  root(
    @SlashOption("text")
    text: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(text);
  }
}

@Discord()
export abstract class AppDiscord1 {
  @Slash("hello")
  add(
    @SlashOption("text")
    text: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(text);
  }
}
