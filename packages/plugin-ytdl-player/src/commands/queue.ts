/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

import { musicPlayerManager } from "../core/index.js";
import { showQueue } from "../utils/index.js";

@Discord()
@SlashGroup("music")
export class Command {
  @Slash({ description: "View queue", name: "queue" })
  async queue(interaction: CommandInteraction): Promise<void> {
    const cmd = await musicPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    clearTimeout(cmd.autoDeleteTimer);
    const { queue } = cmd;
    await showQueue(queue, interaction);
  }
}
