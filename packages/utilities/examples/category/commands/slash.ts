/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Pagination } from "@discordx/pagination";
import { Category, Description, type ICategory } from "@discordx/utilities";
import { EmbedBuilder, type CommandInteraction } from "discord.js";
import {
  DApplicationCommand,
  Discord,
  MetadataStorage,
  Slash,
  type DSimpleCommand,
} from "discordx";

@Discord()
@Category("Admin Commands")
export class SlashExample {
  @Slash({ description: "test" })
  @Description("test description decorator")
  async test(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Hey!");
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
      },
    );

    const pages = commands.map((cmd, i) => {
      const embed = new EmbedBuilder()
        .setFooter({
          text: `Page ${String(i + 1)} of ${commands.length.toString()}`,
        })
        .setTitle("**Slash command info**")
        .addFields({ name: "Name", value: cmd.name })
        .addFields({ name: "Description", value: cmd.description })
        .addFields({ name: "Type", value: cmd.type });

      return { embeds: [embed] };
    });

    void new Pagination(interaction, pages).send();
  }
}
