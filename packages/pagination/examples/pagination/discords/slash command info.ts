import type { ChatInputCommandInteraction } from "discord.js";
import { Embed } from "discord.js";
import { Discord, MetadataStorage, Slash } from "discordx";

import { Pagination } from "../../../build/cjs/index.js";

@Discord()
export abstract class SlashExample {
  // example: pagination for all slash command
  @Slash("slashes", { description: "Pagination for all slash command" })
  pages(interaction: ChatInputCommandInteraction): void {
    const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
      return { description: cmd.description, name: cmd.name };
    });

    const pages = commands.map((cmd, i) => {
      return new Embed()
        .setFooter({ text: `Page ${i + 1} of ${commands.length}` })
        .setTitle("**Slash command info**")
        .addField({ name: "Name", value: cmd.name })
        .addField({ name: "Description", value: cmd.description });
    });

    new Pagination(interaction, pages).send();
  }
}
