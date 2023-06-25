import { dirname, isESM } from "@discordx/importer";
import type { Client } from "discord.js";
import { EventEmitter } from "events";
import { Worker } from "worker_threads";

import type {
  GuildData,
  JoinData,
  ParentProcessDataPayload,
  PlayData,
  QueueEventPayloads,
  SetVolumeData,
  WorkerDataPayload,
} from "./types/index.js";
import {
  ParentProcessEvent,
  QueueEvent,
  WorkerOperation,
} from "./types/index.js";

const folder = isESM ? dirname(import.meta.url) : __dirname;

export interface QueueNode extends EventEmitter {
  on<T extends QueueEvent>(
    event: T,
    listener: (payload: QueueEventPayloads[T]) => void
  ): this;
}

export class QueueNode extends EventEmitter {
  private worker: Worker;

  constructor(public client: Client) {
    super();

    this.worker = new Worker(`${folder}/worker/index.js`);
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
    this.worker.on("message", async (payload: ParentProcessDataPayload) => {
      this.emit(QueueEvent.ParentProcessEvent, payload);

      switch (payload.op) {
        case ParentProcessEvent.VoiceStateUpdate:
          await this.handleWorkerVoiceStateUpdate(payload.data);
          break;

        case ParentProcessEvent.ConnectionDestroy:
          this.handleWorkerConnectionDestroy(payload.data);
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

  join(data: JoinData): void {
    this.sendOp({ data, op: WorkerOperation.Join });
  }

  play(data: PlayData): void {
    this.sendOp({ data, op: WorkerOperation.Play });
  }

  pingPlaybackInfo(data: GuildData): void {
    this.sendOp({ data, op: WorkerOperation.PingPlaybackInfo });
  }

  setVolume(data: SetVolumeData): void {
    this.sendOp({ data, op: WorkerOperation.SetVolume });
  }

  pause(data: GuildData): void {
    this.sendOp({ data, op: WorkerOperation.Pause });
  }

  unpause(data: GuildData): void {
    this.sendOp({ data, op: WorkerOperation.Unpause });
  }

  stop(data: GuildData): void {
    this.sendOp({ data, op: WorkerOperation.Stop });
  }

  disconnect(data: GuildData): void {
    this.sendOp({ data, op: WorkerOperation.Disconnect });
  }

  disconnectAll(): void {
    this.sendOp({ op: WorkerOperation.DisconnectAll });
  }
}
