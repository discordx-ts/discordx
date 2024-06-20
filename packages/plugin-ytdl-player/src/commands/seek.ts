/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { fromMS, musicPlayerManager } from "../core/index.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "Play current track on specific time", name: "seek" })
  async seek(
    @SlashOption({
      description: "time in seconds",
      name: "seconds",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    seconds: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    if (!queue.currentPlaybackTrack) {
      await interaction.followUp({
        content: "> I am not sure, I am playing anything",
      });
      return;
    }

    const maxSeconds = Math.ceil(queue.currentPlaybackTrack.duration / 1000);
    if (seconds > maxSeconds) {
      await interaction.followUp({
        content: `Track ${queue.currentPlaybackTrack.title} max length in seconds is ${String(maxSeconds)}`,
      });
      return;
    }

    queue.seek(seconds * 1000);

    await interaction.followUp(
      `> Playing ${queue.currentPlaybackTrack.title} at ${fromMS(seconds * 1000)}`,
    );
  }
}
