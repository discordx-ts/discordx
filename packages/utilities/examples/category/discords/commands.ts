import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Category } from "../../../build/cjs/v2";

@Discord()
@Category("Admin Commands")
export abstract class SlashExample {
  @Slash("testx")
  async testx(interaction: CommandInteraction): Promise<void> {
    interaction.reply("Hey!");
  }
}
