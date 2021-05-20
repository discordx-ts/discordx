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
  Guard,
  Group,
} from "../../../src";

@Discord()
class B {
  @Slash()
  b() {}
}

@Discord()
@Group("X")
class X {
  @Slash()
  x() {}
}

@Discord()
@Group("Y", { Z: "yes" })
class Y {
  @Group("Z")
  @Slash()
  z() {}
}

@Discord()
@Group("Testing", "Testing description", {
  Text: "text",
  Math: "maths"
})
export abstract class AppDiscord {
  @On("message")
  onMessage([message]: ArgsOf<"message">, client: Client, a, b) {
    console.log(message.content);
  }

  @Slash("hello")
  @Group("Text")
  hello(
    @Option("message", { description: "Say hello" })
    message: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(message);
  }

  @Slash("add")
  @Group("Math")
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
  @Group("Math")
  multiply(
    @Option("x", { description: "x value" })
    x: number,
    @Option("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x * y));
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
