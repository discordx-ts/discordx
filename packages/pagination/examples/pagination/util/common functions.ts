import { EmbedBuilder } from "discord.js";

import type { PaginationItem } from "../../../src/types.js";

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
