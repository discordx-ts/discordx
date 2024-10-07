/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { parentPort } from "node:worker_threads";

import type { WorkerDataPayload } from "../types/communication-worker.js";
import { WorkerOperation } from "../types/communication-worker.js";
import { AudioNodeManager } from "./audio-node-manager.js";

const clients = new AudioNodeManager();

if (parentPort) {
  parentPort.on("message", ({ data, op }: WorkerDataPayload) => {
    switch (op) {
      case WorkerOperation.Disconnect: {
        clients.disconnect(data);
        break;
      }

      case WorkerOperation.DisconnectAll: {
        clients.disconnectAll();
        break;
      }

      case WorkerOperation.Join: {
        clients.connect(data);
        break;
      }

      case WorkerOperation.OnVoiceServerUpdate: {
        clients.adapters.get(data.guild_id)?.onVoiceServerUpdate(data);
        break;
      }

      case WorkerOperation.OnVoiceStateUpdate: {
        clients.adapters.get(data.guild_id)?.onVoiceStateUpdate(data);
        break;
      }

      case WorkerOperation.Play: {
        clients.play(data);
        break;
      }

      case WorkerOperation.Pause: {
        clients.pause(data);
        break;
      }

      case WorkerOperation.Resume: {
        clients.resume(data);
        break;
      }

      case WorkerOperation.Stop: {
        clients.stop(data);
        break;
      }

      case WorkerOperation.SetVolume: {
        clients.setVolume(data);
        break;
      }

      case WorkerOperation.PingPlaybackInfo: {
        clients.sendPlaybackInfo(data);
        break;
      }

      default:
        break;
    }
  });
}
