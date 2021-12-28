import { CommandInteraction, Message } from "discord.js";
import { Discord, Slash } from "discordx";
import { Category } from "../../../build/cjs/v2";

@Discord()
@Category("Admin Commands")
export abstract class SlashExample {
  // commands
  @Slash("testx")
  async testx(interaction: CommandInteraction): Promise<void> {
    const msg = await interaction.reply({ content: "asd", fetchReply: true });
    if (msg instanceof Message) {
      msg.react(":smile:");
    }
  }
}
