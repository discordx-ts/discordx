/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { GetPlayer, Node, OPEvent } from "@discordx/lava-player";
import { EventType, TrackEndReason } from "@discordx/lava-player";
import type { Snowflake } from "discord.js";
import { Collection } from "discord.js";

import { Queue } from "./queue.js";

interface PlayerOptions {
  leaveOnFinish: boolean;
}

export class Player {
  public queues = new Collection<Snowflake, Queue>();
  private _options: PlayerOptions = {
    leaveOnFinish: true,
  };

  get options(): PlayerOptions {
    return this._options;
  }

  constructor(public node: Node) {
    node.on("playerUpdate", (e: GetPlayer) => {
      const queue = this.queues.get(e.guildId);
      if (queue) {
        queue.setPlaybackPosition(e.state.position);
      }
    });

    node.on("event", (raw: OPEvent) => {
      if (
        raw.type === EventType.TrackEndEvent &&
        raw.reason === TrackEndReason.FINISHED
      ) {
        const queue = this.queues.get(raw.guildId);
        if (!queue) {
          return;
        }

        void queue.playNext();

        if (
          this.options.leaveOnFinish &&
          !queue.currentPlaybackTrack &&
          !queue.tracks.length
        ) {
          void queue.lavaPlayer.leave();
        }
      }
    });
  }

  public setOptions(options: PlayerOptions): void {
    this._options = options;
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

    const clazz = resolver ? resolver() : (new Queue(this, guildId) as T);

    // store queue
    this.queues.set(guildId, clazz);

    // return queue
    return clazz;
  }
}
