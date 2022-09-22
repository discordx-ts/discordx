import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import fs from "fs/promises";

import type { PaginationItem } from "../../../src/index.js";
import { Pagination } from "../../../src/index.js";

@Discord()
export class SlashExample {
  // example: pagination for all slash command
  @Slash({
    description: "pagination attachment",
    name: "pagination-attachment",
  })
  async cmd(interaction: CommandInteraction): Promise<void> {
    const filename = "tmp/hello.txt";
    await fs.mkdir("tmp").catch(() => null);
    await fs.writeFile(filename, "test string");
    const pages: PaginationItem[] = [
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
