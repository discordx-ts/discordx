import type { CommandInteraction, GuildMember, Role, User } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

import { Discord, Slash, SlashGroup, SlashOption } from "../../../src/index.js";

@Discord()
@SlashGroup({ name: "testing" })
@SlashGroup({ name: "maths", root: "testing" })
@SlashGroup({ name: "text", root: "testing" })
export class Example {
  @Slash({ name: "voice-channel" })
  @SlashGroup("maths", "testing")
  voiceChannel(
    @SlashOption({
      channelTypes: [
        ChannelType.GuildCategory,
        ChannelType.GuildVoice,
        ChannelType.GuildText,
      ],
      name: "channel",
      type: ApplicationCommandOptionType.Channel,
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash({ name: "voice-channel-x" })
  voiceChannelX(
    @SlashOption({
      channelTypes: [
        ChannelType.GuildCategory,
        ChannelType.GuildVoice,
        ChannelType.GuildText,
      ],
      name: "channel",
      type: ApplicationCommandOptionType.Channel,
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash({ name: "add" })
  @SlashGroup("maths", "testing")
  add(
    @SlashOption({ description: "x value", name: "x" }) x: number,
    @SlashOption({ description: "y value", name: "y" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x + y));
  }

  @Slash({ name: "multiply" })
  @SlashGroup("maths", "testing")
  multiply(
    @SlashOption({ description: "x value", name: "x" }) x: number,
    @SlashOption({ description: "y value", name: "y" }) y: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply(String(x * y));
  }
}
