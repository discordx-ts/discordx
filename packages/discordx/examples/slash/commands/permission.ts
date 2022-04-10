import type {
  ApplicationCommandPermissions,
  CommandInteraction,
  GuildMember,
  Role,
  User,
} from "discord.js";

import {
  DefaultPermissionResolver,
  Discord,
  Permission,
  Slash,
  SlashOption,
} from "../../../src/index.js";

@Discord()
export class Example {
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
    type: "USER",
  })
  @Permission(async (): Promise<ApplicationCommandPermissions[]> => {
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
        type: "USER",
      },
    ];
  })
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
}
