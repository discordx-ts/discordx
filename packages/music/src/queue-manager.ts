/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { AudioPlayerStatus } from "@discordjs/voice";
import type { Snowflake } from "discord.js";
import { Collection } from "discord.js";

import type { Node } from "./node.js";
import { Queue } from "./queue.js";
import {
  AudioNodeEvent,
  ParentProcessEvent,
  QueueEvent,
} from "./types/index.js";

export class QueueManager {
  public queues = new Collection<Snowflake, Queue>();

  constructor(public node: Node) {
    node.on(QueueEvent.ParentProcessEvent, (payload) => {
      const queue = this.queues.get(payload.data.guildId);
      if (!queue) {
        return;
      }

      if (payload.op === ParentProcessEvent.AudioNodeEvent) {
        /**
         * Playback info
         */
        if (payload.data.payload.type === AudioNodeEvent.PlaybackInfo) {
          queue.setPlaybackInfo(payload.data.payload);
        }

        /**
         * When state change
         */
        if (payload.data.payload.type === AudioNodeEvent.StateChange) {
          const { newState } = payload.data.payload;

          /**
           * Sync player state
           */
          queue.setPlayerState(newState);

          if (newState === AudioPlayerStatus.Playing) {
            queue.startPing();
          } else {
            queue.stopPing();
          }

          /**
           * Process queue, when player goes into idle state
           */
          if (
            newState === AudioPlayerStatus.Idle ||
            newState === AudioPlayerStatus.AutoPaused
          ) {
            queue.playNext();
          }

          /**
           * Leave the voice channel if it is enabled and there is no next track to play.
           */
          if (
            queue.leaveOnFinish &&
            !queue.currentPlaybackTrack &&
            !queue.tracks.length
          ) {
            queue.leave();
          }
        }
      }
    });
  }

  public queue<T extends Queue = Queue>(
    guildId: string,
    resolver?: () => T,
  ): T {
    const queue = this.queues.get(guildId) as T | undefined;

    // If a queue already exists, return it
    if (queue) {
      return queue;
    }

    const clazz = resolver ? resolver() : (new Queue(this.node, guildId) as T);

    // store queue
    this.queues.set(guildId, clazz);

    // return queue
    return clazz;
  }
}
