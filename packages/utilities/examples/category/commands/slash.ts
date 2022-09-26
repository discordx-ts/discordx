import { Pagination } from "@discordx/pagination";
import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import type { DSimpleCommand } from "discordx";
import { DApplicationCommand, Discord, MetadataStorage, Slash } from "discordx";

import type { ICategory } from "../../../src/index.js";
import { Category, Description } from "../../../src/index.js";

@Discord()
@Category("Admin Commands")
export class SlashExample {
  @Slash({ description: "test" })
  @Description("test description decorator")
  test(interaction: CommandInteraction): void {
    interaction.reply("Hey!");
  }

  @Slash({ description: "help" })
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
      const embed = new EmbedBuilder()
        .setFooter({ text: `Page ${i + 1} of ${commands.length}` })
        .setTitle("**Slash command info**")
        .addFields({ name: "Name", value: cmd.name })
        .addFields({ name: "Description", value: cmd.description })
        .addFields({ name: "Type", value: cmd.type });

      return { embeds: [embed] };
    });

    new Pagination(interaction, pages).send();
  }
}
