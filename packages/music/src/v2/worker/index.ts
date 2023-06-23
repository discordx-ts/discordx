import { parentPort } from "node:worker_threads";

import { WorkerOp } from "../types/enum.js";
import type { WorkerPayload } from "../types/worker.js";
import { SubscriptionClient } from "./SubscriptionClient.js";

const clients = new SubscriptionClient();

if (parentPort) {
  parentPort.on("message", ({ data, op }: WorkerPayload) => {
    switch (op) {
      case WorkerOp.Disconnect:
        clients.disconnect(data);
        break;
      case WorkerOp.DisconnectAll:
        clients.disconnectAll();
        break;
      case WorkerOp.Join:
        clients.connect(data);
        break;
      case WorkerOp.OnVoiceServerUpdate:
        clients.adapters.get(data.guild_id)?.onVoiceServerUpdate(data);
        break;
      case WorkerOp.OnVoiceStateUpdate:
        clients.adapters.get(data.guild_id)?.onVoiceStateUpdate(data);
        break;
      case WorkerOp.Play:
        const node = clients.subscriptions.get(data.guildId);
        if (node) {
          node.play(data.payload);
        }
        break;
      default:
        break;
    }
  });
}
