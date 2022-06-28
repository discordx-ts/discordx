import type { CommandInteraction, GuildMember, Role, User } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

import type { SimpleCommandPermissionData } from "../../../src/index.js";
import {
  Discord,
  SimpleCommandPermissionTypes,
  SimplePermission,
  Slash,
  SlashOption,
} from "../../../src/index.js";

@Discord()
export class Example {
  @Slash("voice-channel")
  @SimplePermission(false)
  @SimplePermission({
    id: "462341082919731200",
    permission: true,
    type: SimpleCommandPermissionTypes.User,
  })
  @SimplePermission(async (): Promise<SimpleCommandPermissionData[]> => {
    const getResponse = () => {
      return new Promise((resolve) => {
        setTimeout(function () {
          resolve(true);
        }, 5000);
      });
    };
    await getResponse(); // add delay
    return [
      {
        id: "462341082919731200",
        permission: true,
        type: SimpleCommandPermissionTypes.User,
      },
    ];
  })
  voiceChannel(
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
}
