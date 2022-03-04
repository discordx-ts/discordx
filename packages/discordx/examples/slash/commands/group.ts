import type { CommandInteraction, GuildMember, Role, User } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

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
  @SlashGroup("maths", "testing")
  voicechannel(
    @SlashOption("channel", {
      channelTypes: [
        ChannelType.GuildCategory,
        ChannelType.GuildVoice,
        ChannelType.GuildText,
      ],
      type: ApplicationCommandOptionType.Channel,
    })
    roleOrUser: GuildMember | User | Role,
    interaction: CommandInteraction
  ): void {
    interaction.reply(`${roleOrUser}`);
  }

  @Slash("voice-channel-x")
  voiceChannelX(
    @SlashOption("channel", {
      channelTypes: [
        ChannelType.GuildCategory,
        ChannelType.GuildVoice,
        ChannelType.GuildText,
      ],
      type: ApplicationCommandOptionType.Channel,
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

  @Slash("hello")
  @SlashGroup("text", "testing")
  hello(
    @SlashChoice(TextChoices)
    @SlashOption("text", {
      type: ApplicationCommandOptionType.String,
    })
    text: TextChoices,
    interaction: CommandInteraction
  ): void {
    interaction.reply(text);
  }
}
