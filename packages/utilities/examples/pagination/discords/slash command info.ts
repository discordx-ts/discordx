import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, MetadataStorage, Slash } from "discordx";
import { Pagination } from "../../../build/cjs/index.cjs";

@Discord()
export abstract class SlashExample {
  // example: pagination for all slash command
  @Slash("slashes", { description: "Pagination for all slash command" })
  pages(interaction: CommandInteraction): void {
    const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
      return { description: cmd.description, name: cmd.name };
    });

    const pages = commands.map((cmd, i) => {
      return new MessageEmbed()
        .setFooter(`Page ${i + 1} of ${commands.length}`)
        .setTitle("**Slash command info**")
        .addField("Name", cmd.name)
        .addField("Description", cmd.description);
    });

    new Pagination(interaction, pages).send();
  }
}
