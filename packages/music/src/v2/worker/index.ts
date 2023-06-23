import { parentPort } from "node:worker_threads";

import type { WorkerDataPayload } from "../types/communication-worker.js";
import { WorkerOperation } from "../types/communication-worker.js";
import { SubscriptionClient } from "./SubscriptionClient.js";

const clients = new SubscriptionClient();

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
        const node = clients.subscriptions.get(data.guildId);
        if (node) {
          node.play(data.payload);
        }
        break;
      }

      case WorkerOperation.SetVolume: {
        const node = clients.subscriptions.get(data.guildId);
        if (node) {
          node.setVolume(data.volume);
        }
        break;
      }

      default:
        break;
    }
  });
}
