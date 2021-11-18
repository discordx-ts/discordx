/* eslint-disable @typescript-eslint/no-explicit-any */
import ClusterNode, { ClusterNodeOptions } from "./ClusterNode.mjs";
import BaseCluster from "./base/Cluster.mjs";

export interface ClusterOptions {
  filter?: (node: ClusterNode, guildId: string) => boolean;
  nodes?: ClusterNodeOptions[];
  send: (guildId: string, packet: any) => any;
}

export default class Cluster extends BaseCluster {
  public filter: (node: ClusterNode, guildId: string) => boolean;
  public send: (guildId: string, packet: any) => any;

  constructor(options: ClusterOptions) {
    super(options.nodes);
    this.filter = options.filter || (() => true);
    this.send = options.send;
  }
}
