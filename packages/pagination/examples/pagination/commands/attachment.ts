import type { CommandInteraction, MessageOptions } from "discord.js";
import { Discord, Slash } from "discordx";
import fs from "fs/promises";

import { Pagination } from "../../../src/index.js";

@Discord()
export abstract class SlashExample {
  // example: pagination for all slash command
  @Slash("pagination-attachment")
  async cmd(interaction: CommandInteraction): Promise<void> {
    const filename = "tmp/hello.txt";
    await fs.writeFile(filename, "test string");
    const pages: MessageOptions[] = [
      {
        content: "Page 1",
        files: [filename],
      },
      {
        content: "Page 2",
      },
      {
        content: "Page 3",
        files: [filename],
      },
    ];

    new Pagination(interaction, pages).send();
  }
}
