import type { CommandInteraction, GuildMember, Role, User } from "discord.js";

import { Discord, Slash, SlashGroup, SlashOption } from "../../../src/index.js";

@Discord()
@SlashGroup({ name: "testing" })
@SlashGroup({ name: "maths", root: "testing" })
@SlashGroup({ name: "text", root: "testing" })
export abstract class Group {
  @Slash("voice-channel")
  @SlashGroup("maths", "testing")
  voiceChannel(
    @SlashOption("channel", {
      channelTypes: ["GUILD_CATEGORY", "GUILD_VOICE", "GUILD_TEXT"],
      type: "CHANNEL",
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash("voice-channel-x")
  voiceChannelX(
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
  @SlashGroup("maths", "testing")
  add(
    @SlashOption("x", { description: "x value" }) x: number,
    @SlashOption("y", { description: "y value" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x + y));
  }

  @Slash("multiply")
  @SlashGroup("maths", "testing")
  multiply(
    @SlashOption("x", { description: "x value" }) x: number,
    @SlashOption("y", { description: "y value" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x * y));
  }
}
