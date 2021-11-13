import { CommandInteraction, GuildMember, Role, User } from "discord.js";
import {
  DefaultPermissionResolver,
  Discord,
  Permission,
  Slash,
  SlashOption,
} from "../../../src/index.js";

@Discord()
export abstract class AppDiscord {
  @Slash("voicechannel")
  @Permission(
    new DefaultPermissionResolver((command) => {
      if (!command) {
        return false;
      }
      return false;
    })
  )
  @Permission({
    id: "462341082919731201",
    permission: true,
    type: "USER",
  })
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
}
