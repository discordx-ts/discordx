/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Pagination } from "@discordx/pagination";
import { EmbedBuilder, type CommandInteraction } from "discord.js";
import { Discord, MetadataStorage, Slash } from "discordx";

@Discord()
export class Example {
  // example: pagination for all slash command
  @Slash({ description: "Pagination for all slash command", name: "slashes" })
  async slashes(interaction: CommandInteraction): Promise<void> {
    const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
      return { description: cmd.description, name: cmd.name };
    });

    const pages = commands.map((cmd, i) => {
      const embed = new EmbedBuilder()
        .setFooter({
          text: `Page ${String(i + 1)} of ${commands.length.toString()}`,
        })
        .setTitle("**Slash command info**")
        .addFields({ name: "Name", value: cmd.name })
        .addFields({ name: "Description", value: cmd.description });

      return { embeds: [embed] };
    });

    const pagination = new Pagination(interaction, pages, {
      filter: (interact) => interact.user.id === interaction.user.id,
    });

    await pagination.send();
  }
}
