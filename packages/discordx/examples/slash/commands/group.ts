/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { CommandInteraction, GuildMember, Role, User } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

@Discord()
@SlashGroup({ description: "testing", name: "testing" })
@SlashGroup({ description: "maths", name: "maths", root: "testing" })
@SlashGroup({ description: "text", name: "text", root: "testing" })
export class Example {
  @Slash({ description: "voice-channel", name: "voice-channel" })
  @SlashGroup("maths", "testing")
  async voiceChannel(
    @SlashOption({
      channelTypes: [
        ChannelType.GuildCategory,
        ChannelType.GuildVoice,
        ChannelType.GuildText,
      ],
      description: "channel",
      name: "channel",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(roleOrUser.toString());
  }

  @Slash({ description: "voice-channel-x", name: "voice-channel-x" })
  async voiceChannelX(
    @SlashOption({
      channelTypes: [
        ChannelType.GuildCategory,
        ChannelType.GuildVoice,
        ChannelType.GuildText,
      ],
      description: "channel",
      name: "channel",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.reply(roleOrUser.toString());
  }

  @Slash({ description: "add", name: "add" })
  @SlashGroup("maths", "testing")
  async add(
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
  ): Promise<void> {
    await interaction.reply(String(x + y));
  }

  @Slash({ description: "multiply", name: "multiply" })
  @SlashGroup("maths", "testing")
  async multiply(
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
  ): Promise<void> {
    await interaction.reply(String(x * y));
  }
}
