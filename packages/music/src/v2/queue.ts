import type { Client } from "discord.js";
import { Worker } from "worker_threads";

import { WorkerEvent, WorkerOp } from "./types/enum.js";
import type { SubscriptionPayload } from "./types/worker.js";

export class Queue {
  private worker: Worker;

  constructor(public client: Client) {
    this.worker = new Worker("./build/esm/v2/worker/index.js");
    this.setupEventListeners();
    this.setupWorkerMessageHandler();
  }

  private setupEventListeners(): void {
    this.client.on("raw", (event: any) => {
      if (event.t === "VOICE_STATE_UPDATE") {
        this.handleVoiceStateUpdate(event.d);
      } else if (event.t === "VOICE_SERVER_UPDATE") {
        this.handleVoiceServerUpdate(event.d);
      }
    });
  }

  private handleVoiceStateUpdate(data: any): void {
    this.worker.postMessage({
      d: data,
      op: WorkerOp.OnVoiceStateUpdate,
    });
  }

  private handleVoiceServerUpdate(data: any): void {
    this.worker.postMessage({
      d: data,
      op: WorkerOp.OnVoiceServerUpdate,
    });
  }

  private setupWorkerMessageHandler(): void {
    this.worker.on("message", async (message: { d: any; op: WorkerEvent }) => {
      switch (message.op) {
        case WorkerEvent.VoiceStateUpdate:
          await this.handleWorkerVoiceStateUpdate(message.d);
          break;

        case WorkerEvent.ConnectionDestroy:
          this.handleWorkerConnectionDestroy(message.d);
          break;

        default:
          break;
      }
    });
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
    this.worker.postMessage({
      d: data,
      op: WorkerOp.Join,
    });
  }

  play(data: { guildId: string; payload: { query: string } }): void {
    this.worker.postMessage({
      d: data,
      op: WorkerOp.Play,
    });
  }
}
