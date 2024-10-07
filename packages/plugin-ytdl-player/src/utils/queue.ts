/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import {
  Pagination,
  PaginationResolver,
  PaginationType,
} from "@discordx/pagination";
import type { ButtonInteraction, CommandInteraction } from "discord.js";
import { Message } from "discord.js";

import type { MusicQueue } from "../core/index.js";
import { deleteMessage, fromMS } from "./index.js";

export async function showQueue(
  queue: MusicQueue,
  interaction: CommandInteraction | ButtonInteraction,
): Promise<void> {
  const currentTrack = queue.currentPlaybackTrack;
  if (!currentTrack) {
    const pMsg = await interaction.followUp({
      content: "> could not process queue atm, try later!",
      ephemeral: true,
    });
    if (pMsg instanceof Message) {
      setTimeout(() => void deleteMessage(pMsg), 3000);
    }
    return;
  }

  if (!queue.size) {
    const pMsg = await interaction.followUp({
      content: `> Playing **${currentTrack.title}**`,
      embeds: currentTrack.thumbnail
        ? [{ image: { url: currentTrack.thumbnail } }]
        : [],
    });

    if (pMsg instanceof Message) {
      setTimeout(() => void deleteMessage(pMsg), 1e4);
    }
    return;
  }

  const current = `> Playing **${currentTrack.title}** out of ${String(
    queue.size + 1,
  )}`;

  const pageOptions = new PaginationResolver(
    (index, paginator) => {
      paginator.maxLength = queue.size / 10;
      if (index > paginator.maxLength) {
        paginator.currentPage = 0;
      }

      const currentPage = paginator.currentPage;

      const tracks = queue.tracks
        .slice(currentPage * 10, currentPage * 10 + 10)
        .map(
          (track, index1) =>
            `${String(currentPage * 10 + index1 + 1)}. ${track.title}` +
            ` (${fromMS(track.duration)})`,
        )
        .join("\n\n");

      return { content: `${current}\n\`\`\`markdown\n${tracks}\`\`\`` };
    },
    Math.floor(queue.size / 10),
  );

  await new Pagination(interaction, pageOptions, {
    enableExit: true,
    onTimeout: (_, message) => {
      void deleteMessage(message);
    },
    time: 6e4,
    type:
      Math.floor(queue.size / 10) <= 5
        ? PaginationType.Button
        : PaginationType.SelectMenu,
  }).send();
}
