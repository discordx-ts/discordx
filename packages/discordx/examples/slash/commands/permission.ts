import type {
  ApplicationCommandPermissions,
  CommandInteraction,
  GuildMember,
  Role,
  User,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  ApplicationCommandPermissionType,
  ChannelType,
} from "discord.js";

import {
  DefaultPermissionResolver,
  Discord,
  Permission,
  Slash,
  SlashOption,
} from "../../../src/index.js";

@Discord()
export abstract class AppDiscord {
  @Slash("voice-channel")
  @Permission(
    new DefaultPermissionResolver((command) => {
      if (!command) {
        return false;
      }
      return false;
    })
  )
  @Permission({
    id: "462341082919731200",
    permission: true,
    type: ApplicationCommandPermissionType.User,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Permission(async (guild, cmd): Promise<ApplicationCommandPermissions[]> => {
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
        type: ApplicationCommandPermissionType.User,
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
