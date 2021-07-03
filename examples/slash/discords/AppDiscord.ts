import { CommandInteraction } from "discord.js";
import { Discord, Slash, Option, Guild, Group, Choices } from "../../../src";

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
    @Choices(TextChoices)
    @Option("text")
    text: TextChoices,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }

  @Slash("hello")
  root(
    @Option("text")
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
    @Option("text")
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }
}
