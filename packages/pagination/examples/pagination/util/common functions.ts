/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { PaginationItem } from "@discordx/pagination";
import { EmbedBuilder } from "discord.js";

export function GeneratePages(limit?: number): PaginationItem[] {
  const pages = Array.from(Array(limit ?? 20).keys()).map((i) => {
    return { content: `I am ${i + 1}`, embed: `Demo ${i + 1}` };
  });

  return pages.map((page) => {
    return {
      content: page.content,
      embeds: [new EmbedBuilder().setTitle(page.embed)],
    };
  });
}
