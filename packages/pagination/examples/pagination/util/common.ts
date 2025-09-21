/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { PaginationItem } from "@discordx/pagination";
import { EmbedBuilder } from "discord.js";

export function GeneratePages(limit?: number): PaginationItem[] {
  const pages = Array.from(Array(limit ?? 20).keys()).map((i) => {
    return { content: `I am ${String(i + 1)}`, embed: `Demo ${String(i + 1)}` };
  });

  return pages.map((page) => {
    return {
      content: page.content,
      embeds: [new EmbedBuilder().setTitle(page.embed)],
    };
  });
}
