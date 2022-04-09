import type {
  Node,
  RawEventType,
  WsRawEventPlayerUpdate,
} from "@discordx/lava-player";
import { EventType } from "@discordx/lava-player";
import type { Snowflake } from "discord.js";
import { Collection } from "discord.js";

import { Queue } from "./queue.js";

type PlayerOptions = {
  leaveOnFinish: boolean;
};

export class Player {
  public queues = new Collection<Snowflake, Queue>();
  private _options: PlayerOptions = {
    leaveOnFinish: true,
  };

  get options(): PlayerOptions {
    return this._options;
  }

  constructor(public node: Node) {
    node.on("playerUpdate", (e: WsRawEventPlayerUpdate) => {
      const queue = this.queues.get(e.guildId);
      if (queue) {
        queue.setPosition(e.state.position ?? 0);
      }
    });

    node.on("event", (raw: RawEventType) => {
      if (raw.type === EventType.TrackEndEvent && raw.reason === "FINISHED") {
        const queue = this.queues.get(raw.guildId);
        if (!queue) {
          return;
        }

        queue.playNext();

        if (
          this.options.leaveOnFinish &&
          !queue.currentTrack &&
          !queue.tracks.length
        ) {
          queue.lavaPlayer.leave();
        }
      }
    });
  }

  public setOptions(options: PlayerOptions): void {
    this._options = options;
  }

  public queue<T extends Queue = Queue>(
    guildId: string,
    resolver?: () => T
  ): T {
    const queue = this.queues.get(guildId) as T;

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
