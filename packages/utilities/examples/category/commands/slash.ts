import { Pagination } from "@discordx/pagination";
import type { CommandInteraction } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { DSimpleCommand } from "discordx";
import { DApplicationCommand, Discord, MetadataStorage, Slash } from "discordx";

import type { ICategory } from "../../../src/index.js";
import { Category, Description } from "../../../src/index.js";

@Discord()
@Category("Admin Commands")
export abstract class SlashExample {
  @Slash()
  @Description("test description decorator")
  test(interaction: CommandInteraction): void {
    interaction.reply("Hey!");
  }

  @Slash()
  help(interaction: CommandInteraction): void {
    const commands: {
      description: string;
      name: string;
      type: "slash" | "simple";
    }[] = [];

    MetadataStorage.instance.applicationCommands.forEach(
      (cmd: (DApplicationCommand | DSimpleCommand) & ICategory) => {
        if (cmd.category === "Admin Commands") {
          commands.push({
            description: cmd.description,
            name: cmd.name,
            type: cmd instanceof DApplicationCommand ? "slash" : "simple",
          });
        }
      }
    );

    const pages = commands.map((cmd, i) => {
      return new MessageEmbed()
        .setFooter({ text: `Page ${i + 1} of ${commands.length}` })
        .setTitle("**Slash command info**")
        .addField("Name", cmd.name)
        .addField("Description", cmd.description)
        .addField("Type", cmd.type);
    });

    new Pagination(interaction, pages).send();
  }
}
