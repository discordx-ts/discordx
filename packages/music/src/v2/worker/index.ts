import { parentPort } from "node:worker_threads";

import { WorkerOp } from "../types/enum.js";
import type { WorkerPayload } from "../types/worker.js";
import { SubscriptionClient } from "./SubscriptionClient.js";

const clients = new SubscriptionClient();

parentPort?.on("message", (message: WorkerPayload) => {
  switch (message.op) {
    case WorkerOp.disconnect:
      clients.disconnect(message.d);
      break;
    case WorkerOp.disconnectAll:
      clients.disconnectAll();
      break;
    case WorkerOp.join:
      clients.connect(message.d);
      break;
    case WorkerOp.onVoiceServerUpdate:
      clients.adapters.get(message.d.guild_id)?.onVoiceServerUpdate(message.d);
      break;
    case WorkerOp.onVoiceStateUpdate:
      clients.adapters.get(message.d.guild_id)?.onVoiceStateUpdate(message.d);
      break;
    case WorkerOp.play:
      const node = clients.subscriptions.get(message.d.guildId);
      node?.play(message.d.payload);
      break;
  }
});
