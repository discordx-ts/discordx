/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { Node, QueueManager } from "@discordx/music";
import type { Events } from "discord.js";
import { Discord, Once, type ArgsOf, type Client } from "discordx";

import { musicPlayerManager } from "../core/manager.js";

@Discord()
export class Command {
  @Once()
  clientReady(_: ArgsOf<Events.ClientReady>, client: Client): void {
    const node = new Node(client);
    musicPlayerManager.instance = new QueueManager(node);
  }
}
