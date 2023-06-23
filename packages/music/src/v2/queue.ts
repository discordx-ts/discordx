import { isESM } from "@discordx/importer";
import type { Client } from "discord.js";
import { Worker } from "worker_threads";

import {
  type NodePlayerOptions,
  type ParentProcessDataPayload,
  ParentProcessEvent,
  type SubscriptionPayload,
  type WorkerDataPayload,
  WorkerOperation,
} from "./types/index.js";

export class Queue {
  private worker: Worker;

  constructor(public client: Client) {
    this.worker = new Worker(
      `./build/${isESM ? "esm" : "cjs"}/v2/worker/index.js`
    );
    this.setupEventListeners();
    this.setupWorkerMessageHandler();
  }

  private sendOp(payload: WorkerDataPayload): void {
    this.worker.postMessage(payload);
  }

  private setupEventListeners(): void {
    this.client.on("raw", (event: any) => {
      if (event.t === "VOICE_STATE_UPDATE") {
        this.sendOp({ data: event.d, op: WorkerOperation.OnVoiceStateUpdate });
      } else if (event.t === "VOICE_SERVER_UPDATE") {
        this.sendOp({
          data: event.d,
          op: WorkerOperation.OnVoiceServerUpdate,
        });
      }
    });
  }

  private setupWorkerMessageHandler(): void {
    this.worker.on(
      "message",
      async ({ data, op }: ParentProcessDataPayload) => {
        switch (op) {
          case ParentProcessEvent.VoiceStateUpdate:
            await this.handleWorkerVoiceStateUpdate(data);
            break;

          case ParentProcessEvent.ConnectionDestroy:
            this.handleWorkerConnectionDestroy(data);
            break;

          case ParentProcessEvent.AudioNodeEvent:
            console.log(data);
            break;

          default:
            break;
        }
      }
    );
  }

  private async handleWorkerVoiceStateUpdate(data: any): Promise<void> {
    const guild = await this.client.guilds.fetch(data.guildId);
    guild.shard.send(data.payload);
  }

  private handleWorkerConnectionDestroy(data: {
    channelId: string;
    guildId: string;
  }): void {
    const { channelId } = data;
    this.client.voice.adapters.get(channelId)?.destroy();
  }

  join(data: SubscriptionPayload): void {
    this.sendOp({ data: data, op: WorkerOperation.Join });
  }

  play(data: { guildId: string; payload: NodePlayerOptions }): void {
    this.sendOp({ data: data, op: WorkerOperation.Play });
  }

  setVolume(data: { guildId: string; volume: number }): void {
    this.sendOp({ data: data, op: WorkerOperation.SetVolume });
  }
}
