import { parentPort } from "node:worker_threads";

import { WorkerOp } from "../types/enum.js";
import type { WorkerPayload } from "../types/worker.js";
import { SubscriptionClient } from "./SubscriptionClient.js";

const clients = new SubscriptionClient();

parentPort?.on("message", (message: WorkerPayload) => {
  switch (message.op) {
    case WorkerOp.Disconnect:
      clients.disconnect(message.d);
      break;
    case WorkerOp.DisconnectAll:
      clients.disconnectAll();
      break;
    case WorkerOp.Join:
      clients.connect(message.d);
      break;
    case WorkerOp.OnVoiceServerUpdate:
      clients.adapters.get(message.d.guild_id)?.onVoiceServerUpdate(message.d);
      break;
    case WorkerOp.OnVoiceStateUpdate:
      clients.adapters.get(message.d.guild_id)?.onVoiceStateUpdate(message.d);
      break;
    case WorkerOp.Play:
      const node = clients.subscriptions.get(message.d.guildId);
      node?.play(message.d.payload);
      break;
  }
});
