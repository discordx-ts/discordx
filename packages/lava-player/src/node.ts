/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { BaseNode } from "./base/base-node.js";
import type { BaseNodeOptions } from "./types/index.js";

export interface NodeOptions extends BaseNodeOptions {
  send: (guildId: string, packet: any) => any;
}

export class Node extends BaseNode {
  public send: (guildId: string, packet: any) => any;

  constructor(options: NodeOptions) {
    super(options);
    this.send = options.send;
  }
}
