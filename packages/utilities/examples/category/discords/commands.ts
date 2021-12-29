import { Discord, Slash } from "discordx";
import { Category } from "../../../build/cjs/v2";
import { CommandInteraction } from "discord.js";

@Discord()
@Category("Admin Commands")
export abstract class SlashExample {
  @Slash("testx")
  testx(interaction: CommandInteraction): void {
    interaction.reply("Hey!");
  }
}
