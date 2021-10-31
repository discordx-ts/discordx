/* eslint-disable @typescript-eslint/no-explicit-any */
import ClusterNode, { ClusterNodeOptions } from "./ClusterNode";
import BaseCluster from "./base/Cluster";

export interface ClusterOptions {
  filter?: (node: ClusterNode, guildID: string) => boolean;
  nodes?: ClusterNodeOptions[];
  send: (guildID: string, packet: any) => any;
}

export default class Cluster extends BaseCluster {
  public filter: (node: ClusterNode, guildID: string) => boolean;
  public send: (guildID: string, packet: any) => any;

  constructor(options: ClusterOptions) {
    super(options.nodes);
    this.filter = options.filter || (() => true);
    this.send = options.send;
  }
}
