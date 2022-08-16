import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, MetadataStorage, Slash } from "discordx";

import { Pagination, PaginationType } from "../../../src/index.js";

@Discord()
export class Example {
  // example: pagination for all slash command
  @Slash({ description: "Pagination for all slash command", name: "slashes" })
  slashes(interaction: CommandInteraction): void {
    const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
      return { description: cmd.description, name: cmd.name };
    });

    const pages = commands.map((cmd, i) => {
      return new EmbedBuilder()
        .setFooter({ text: `Page ${i + 1} of ${commands.length}` })
        .setTitle("**Slash command info**")
        .addFields({ name: "Name", value: cmd.name })
        .addFields({ name: "Description", value: cmd.description });
    });

    new Pagination(interaction, pages, {
      filter: (interact) => interact.user.id === interaction.user.id,
      type: PaginationType.Button,
    }).send();
  }
}
