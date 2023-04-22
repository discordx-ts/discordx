import type { Client } from "discord.js";
import { Worker } from "worker_threads";

import { WorkerEvent, WorkerOp } from "./types/enum.js";
import type { SubscriptionPayload } from "./types/worker.js";

export class Queue {
  worker = new Worker("./build/esm/v2/worker/index.js");

  constructor(public client: Client) {
    this.client.on("raw", (event) => {
      if (event.t === "VOICE_STATE_UPDATE") {
        this.worker.postMessage({
          d: event.d,
          op: WorkerOp.onVoiceStateUpdate,
        });
      }
    });

    this.client.on("raw", (event) => {
      if (event.t === "VOICE_SERVER_UPDATE") {
        this.worker.postMessage({
          d: event.d,
          op: WorkerOp.onVoiceServerUpdate,
        });
      }
    });

    this.worker.on("message", async (message: { d: any; op: WorkerEvent }) => {
      switch (message.op) {
        case WorkerEvent.VOICE_STATE_UPDATE:
          const guild = await this.client.guilds.fetch(message.d.guildId);
          guild.shard.send(message.d.payload);
          break;

        case WorkerEvent.CONNECTION_DESTROY:
          const { channelId } = message.d as {
            channelId: string;
            guildId: string;
          };

          // Destroy the voice adapter
          this.client.voice.adapters.get(channelId)?.destroy();
          break;
        default:
          break;
      }
    });
  }

  join(data: SubscriptionPayload): void {
    this.worker.postMessage({
      d: data,
      op: WorkerOp.join,
    });
  }

  play(data: { guildId: string; payload: { query: string } }): void {
    this.worker.postMessage({
      d: data,
      op: WorkerOp.play,
    });
  }
}
