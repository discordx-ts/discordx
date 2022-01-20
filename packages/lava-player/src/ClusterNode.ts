/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseNode from "./base/Node.js";
import { BaseNodeOptions } from "./types/index.js";
import Cluster from "./base/Cluster.js";

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

  constructor(public readonly cluster: Cluster, options: ClusterNodeOptions) {
    super(options);
    this.tags = new Set(options.tags || []);
    this.on("stats", (stats) => (this.stats = stats));
  }

  public emit(name: string | symbol, ...args: any[]): boolean {
    if (this.listenerCount(name)) {
      super.emit(name, ...args);
    }
    return this.cluster.emit(name, ...args);
  }

  public send = (guildId: string, pk: object): Promise<any> =>
    this.cluster.send(guildId, pk);

  public async destroy(code?: number, data?: string): Promise<void> {
    await super.destroy(code, data);
    this.cluster.nodes.splice(this.cluster.nodes.indexOf(this), 1);
  }
}
