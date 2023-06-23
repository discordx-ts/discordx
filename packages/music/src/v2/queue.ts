import type { Client } from "discord.js";
import { Worker } from "worker_threads";

import { WorkerEvent, WorkerOp } from "./types/enum.js";
import type {
  NodePlayerOptions,
  SubscriptionPayload,
  WorkerEventPayload,
  WorkerPayload,
} from "./types/index.js";

export class Queue {
  private worker: Worker;

  constructor(public client: Client) {
    this.worker = new Worker("./build/esm/v2/worker/index.js");
    this.setupEventListeners();
    this.setupWorkerMessageHandler();
  }

  private sendOp(payload: WorkerPayload): void {
    this.worker.postMessage(payload);
  }

  private setupEventListeners(): void {
    this.client.on("raw", (event: any) => {
      if (event.t === "VOICE_STATE_UPDATE") {
        this.sendOp({ data: event.d, op: WorkerOp.OnVoiceStateUpdate });
      } else if (event.t === "VOICE_SERVER_UPDATE") {
        this.sendOp({ data: event.d, op: WorkerOp.OnVoiceServerUpdate });
      }
    });
  }

  private setupWorkerMessageHandler(): void {
    this.worker.on("message", async ({ data, op }: WorkerEventPayload) => {
      switch (op) {
        case WorkerEvent.VoiceStateUpdate:
          await this.handleWorkerVoiceStateUpdate(data);
          break;

        case WorkerEvent.ConnectionDestroy:
          this.handleWorkerConnectionDestroy(data);
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
    this.sendOp({ data: data, op: WorkerOp.Join });
  }

  play(data: { guildId: string; payload: NodePlayerOptions }): void {
    this.sendOp({ data: data, op: WorkerOp.Play });
  }
}
