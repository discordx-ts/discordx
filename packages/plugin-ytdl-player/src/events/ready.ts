/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { Node, QueueManager } from "@discordx/music";
import type { ArgsOf, Client } from "discordx";
import { Discord, Once } from "discordx";

import { musicPlayerManager } from "../core/manager.js";

@Discord()
export class Command {
  @Once()
  ready(_: ArgsOf<"ready">, client: Client): void {
    const node = new Node(client);
    musicPlayerManager.instance = new QueueManager(node);
  }
}
