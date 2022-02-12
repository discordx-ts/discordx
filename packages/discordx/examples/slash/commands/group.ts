import type { CommandInteraction, GuildMember, Role, User } from "discord.js";

import {
  Discord,
  Slash,
  SlashChoice,
  SlashGroup,
  SlashOption,
} from "../../../src/index.js";

enum TextChoices {
  "Good Bye" = "GoodBye",
  Hello = "Hello",
}

@Discord()
@SlashGroup({ name: "testing" })
@SlashGroup({ name: "maths", root: "testing" })
@SlashGroup({ name: "text", root: "testing" })
export abstract class Group {
  @Slash("voicechannel")
  @SlashGroup({ name: "maths", root: "testing" })
  voicechannel(
    @SlashOption("channel", {
      channelTypes: ["GUILD_CATEGORY", "GUILD_VOICE", "GUILD_TEXT"],
      type: "CHANNEL",
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash("voicechannelx")
  voicechannelx(
    @SlashOption("channel", {
      channelTypes: ["GUILD_CATEGORY", "GUILD_VOICE", "GUILD_TEXT"],
      type: "CHANNEL",
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash("add")
  @SlashGroup({ name: "maths", root: "testing" })
  add(
    @SlashOption("x", { description: "x value" }) x: number,
    @SlashOption("y", { description: "y value" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  @SlashGroup({ name: "maths", root: "testing" })
  multiply(
    @SlashOption("x", { description: "x value" }) x: number,
    @SlashOption("y", { description: "y value" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x * y));
  }

  @Slash("hello")
  @SlashGroup({ name: "text", root: "testing" })
  hello(
    @SlashChoice(TextChoices)
    @SlashOption("text", {
      type: "STRING",
    })
    text: TextChoices,
    interaction: CommandInteraction
  ): void {
    interaction.reply(text);
  }

  @Slash("hello")
  root(
    @SlashOption("text") text: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(text);
  }
}
