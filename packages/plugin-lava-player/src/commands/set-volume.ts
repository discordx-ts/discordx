/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { lavaPlayerManager } from "../core/manager.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({
    description:
      "The player volume, in percentage, from 0 to 1000 (default 100)",
    name: "set-volume",
  })
  async setVolume(
    @SlashOption({
      description: "Set volume",
      maxValue: 1000,
      minValue: 0,
      name: "volume",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    volume: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.setVolume(volume);
    await interaction.followUp({
      content: `> volume set to ${String(volume)}`,
    });
  }
}
