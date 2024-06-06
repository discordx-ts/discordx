/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { BaseCluster } from "./base/base-cluster.js";
import { BaseNode } from "./base/base-node.js";
import type { BaseNodeOptions } from "./types/index.js";

export interface ClusterNodeOptions extends BaseNodeOptions {
  tags?: Iterable<string>;
}

export interface Stats {
  cpu?: {
    cores: number;
    lavalinkLoad: number;
    systemLoad: number;
  };
  frameStats?: {
    deficit: number;
    nulled: number;
    sent: number;
  };
  memory?: {
    allocated: number;
    free: number;
    reservable: number;
    used: number;
  };
  players: number;
  playingPlayers: number;
  uptime: number;
}

export default class ClusterNode extends BaseNode {
  public tags: Set<string>;
  public stats?: Stats;

  constructor(
    public readonly cluster: BaseCluster,
    options: ClusterNodeOptions,
  ) {
    super(options);
    this.tags = new Set(options.tags ?? []);
    this.on("stats", (stats) => {
      this.stats = stats;
    });
  }

  public emit(name: string | symbol, ...args: any[]): boolean {
    if (this.listenerCount(name)) {
      super.emit(name, ...args);
    }
    return this.cluster.emit(name, ...args);
  }

  public send = (guildId: string, pk: object): Promise<void> => {
    return this.cluster.send(guildId, pk);
  };

  public async destroy(code?: number, data?: string): Promise<void> {
    await super.destroy(code, data);
    this.cluster.nodes.splice(this.cluster.nodes.indexOf(this), 1);
  }
}
