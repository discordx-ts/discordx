/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { RepeatMode } from "@discordx/lava-queue";
import type { ButtonInteraction, CommandInteraction } from "discord.js";
import { ButtonComponent, Discord, Slash, SlashGroup } from "discordx";

import { lavaPlayerManager } from "../core/manager.js";

@Discord()
@SlashGroup("music")
export class Command {
  // buttons

  @ButtonComponent({ id: "btn-next" })
  async nextControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;

    const next = await queue.playNext();
    if (!next) {
      await queue.exit();
      await interaction.followUp({
        content: "> all queued up, amigo!",
      });
      return;
    }

    await interaction.followUp({
      content: `> Playing ${next.info.title}`,
    });
  }

  @ButtonComponent({ id: "btn-pause" })
  async pauseControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    if (queue.isPlaying) {
      await queue.pause();
    } else {
      await queue.resume();
    }
  }

  @ButtonComponent({ id: "btn-leave" })
  async leaveControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.exit();
  }

  @ButtonComponent({ id: "btn-repeat" })
  async repeatControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const isRepeat = queue.repeatMode === RepeatMode.REPEAT_ONE;
    queue.setRepeatMode(isRepeat ? RepeatMode.OFF : RepeatMode.REPEAT_ONE);
  }

  @ButtonComponent({ id: "btn-loop" })
  async loopControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    const isRepeatAll = queue.repeatMode === RepeatMode.REPEAT_ALL;
    queue.setRepeatMode(isRepeatAll ? RepeatMode.OFF : RepeatMode.REPEAT_ALL);
  }

  @ButtonComponent({ id: "btn-queue" })
  async queueControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    clearTimeout(cmd.autoDeleteTimer);
    const { queue } = cmd;

    await queue.view(interaction);
  }

  @ButtonComponent({ id: "btn-mix" })
  async mixControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.shuffleTracks();
  }

  @ButtonComponent({ id: "btn-controls" })
  async controlsControl(interaction: ButtonInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    await queue.updateControlMessage({ force: true });
  }

  // slashes

  @Slash({ description: "Show GUI controls", name: "gui-show" })
  async guiShow(interaction: CommandInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd || !interaction.channel) {
      return;
    }

    const { queue } = cmd;
    queue.setChannel(interaction.channel);
    queue.startControlUpdate();
    await interaction.followUp({ content: "> Enable GUI mode!" });
  }

  @Slash({ description: "Hide GUI controls", name: "gui-hide" })
  async guiHide(interaction: CommandInteraction): Promise<void> {
    const cmd = await lavaPlayerManager.parseCommand(interaction);
    if (!cmd) {
      return;
    }

    const { queue } = cmd;
    queue.stopControlUpdate();
    await interaction.followUp({ content: "> Disabled GUI mode!" });
  }
}
