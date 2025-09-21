/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import fs from "fs/promises";
import { Pagination, type PaginationItem } from "@discordx/pagination";
import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

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

    const pagination = new Pagination(interaction, pages, { time: 10000 });
    await pagination.send();
  }
}
