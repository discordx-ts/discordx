/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { setTimeout as wait } from "node:timers/promises";

import { QueueManager } from "@discordx/lava-queue";
import type { ArgsOf, Client } from "discordx";
import { Discord, Once } from "discordx";

import { lavaPlayerManager } from "../core/manager.js";
import { getNode } from "../core/node.js";

@Discord()
export class Command {
  @Once()
  async ready(_: ArgsOf<"ready">, client: Client): Promise<void> {
    await wait(5e3);
    lavaPlayerManager.instance = new QueueManager(getNode(client));
  }
}
