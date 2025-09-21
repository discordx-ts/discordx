/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { fromMS } from "@discordx/lava-queue";
import {
  ApplicationCommandOptionType,
  type CommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { lavaPlayerManager } from "../core/manager.js";

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
    const cmd = await lavaPlayerManager.parseCommand(interaction);
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

    const maxSeconds = Math.ceil(queue.currentPlaybackTrack.info.length / 1000);
    if (seconds > maxSeconds) {
      await interaction.followUp({
        content: `Track ${queue.currentPlaybackTrack.info.title} max length in seconds is ${String(maxSeconds)}`,
      });
      return;
    }

    await queue.guildPlayer.update({
      position: seconds * 1000,
    });

    await interaction.followUp(
      `> Playing ${queue.currentPlaybackTrack.info.title} at ${fromMS(seconds * 1000)}`,
    );
  }
}
