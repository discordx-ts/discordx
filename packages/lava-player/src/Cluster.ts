/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { BaseCluster } from "./base/Cluster.js";
import type { ClusterNodeOptions } from "./ClusterNode.js";
import type ClusterNode from "./ClusterNode.js";

export interface ClusterOptions {
  filter?: (node: ClusterNode, guildId: string) => boolean;
  nodes?: ClusterNodeOptions[];
  send: (guildId: string, packet: any) => any;
}

export class Cluster extends BaseCluster {
  public filter: (node: ClusterNode, guildId: string) => boolean;
  public send: (guildId: string, packet: any) => any;

  constructor(options: ClusterOptions) {
    super(options.nodes);
    this.filter = options.filter || (() => true);
    this.send = options.send;
  }
}
