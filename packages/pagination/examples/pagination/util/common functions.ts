import type { MessageOptions } from "discord.js";
import { MessageEmbed } from "discord.js";

export function GeneratePages(limit?: number): MessageOptions[] {
  const pages = Array.from(Array(limit ?? 20).keys()).map((i) => {
    return { content: `I am ${i + 1}`, embed: `Demo ${i + 1}` };
  });

  return pages.map((page) => {
    return {
      content: page.content,
      embeds: [new MessageEmbed().setTitle(page.embed)],
    };
  });
}
