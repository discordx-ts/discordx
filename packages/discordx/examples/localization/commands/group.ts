import type { CommandInteraction, GuildMember, Role, User } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

import { Discord, Slash, SlashGroup, SlashOption } from "../../../src/index.js";

@Discord()
@SlashGroup({ description: "testing", name: "testing" })
@SlashGroup({ description: "maths", name: "maths", root: "testing" })
@SlashGroup({ description: "text", name: "text", root: "testing" })
export class Example {
  @Slash({ description: "maths", name: "voice-channel" })
  @SlashGroup("maths", "testing")
  voiceChannel(
    @SlashOption({
      channelTypes: [
        ChannelType.GuildCategory,
        ChannelType.GuildVoice,
        ChannelType.GuildText,
      ],
      description: "channel",
      name: "asd",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash({ description: "voice-channel-x", name: "voice-channel-x" })
  voiceChannelX(
    @SlashOption({
      channelTypes: [
        ChannelType.GuildCategory,
        ChannelType.GuildVoice,
        ChannelType.GuildText,
      ],
      description: "role-or-user",
      name: "role-or-user",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash({ description: "add" })
  @SlashGroup("maths", "testing")
  add(
    @SlashOption({
      description: "x value",
      name: "x",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    x: number,
    @SlashOption({
      description: "y value",
      name: "y",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    y: number,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(String(x + y));
  }

  @Slash({ description: "multiply" })
  @SlashGroup("maths", "testing")
  multiply(
    @SlashOption({
      description: "x value",
      name: "x",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    x: number,
    @SlashOption({
      description: "y value",
      name: "y",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    y: number,
    interaction: CommandInteraction,
  ): void {
    interaction.reply(String(x * y));
  }
}
