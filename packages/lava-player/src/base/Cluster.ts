/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";

import type { ClusterNodeOptions } from "../ClusterNode.js";
import ClusterNode from "../ClusterNode.js";
import type { Player } from "../core/Player.js";
import type { VoiceServerUpdate, VoiceStateUpdate } from "../types/index.js";

export abstract class BaseCluster extends EventEmitter {
  public abstract send: (guildId: string, packet: any) => any;
  public abstract filter: (node: ClusterNode, guildId: string) => boolean;

  public readonly nodes: ClusterNode[] = [];

  constructor(options?: ClusterNodeOptions[]) {
    super();
    if (options) {
      this.spawn(options);
    }
  }

  public connect(): void {
    for (const node of this.nodes) {
      node.connect();
    }
  }

  public spawn(options: ClusterNodeOptions): ClusterNode;
  public spawn(options: ClusterNodeOptions[]): ClusterNode[];
  public spawn(
    options: ClusterNodeOptions | ClusterNodeOptions[]
  ): ClusterNode | ClusterNode[] {
    if (Array.isArray(options)) {
      return options.map((opt) => this.spawn(opt));
    }

    const node = new ClusterNode(this, options);
    this.nodes.push(node);
    return node;
  }

  public sort(): ClusterNode[] {
    return this.nodes
      .filter((n) => n.connected)
      .sort((a, b) => {
        // sort by overall system cpu load
        if (!a.stats || !b.stats) {
          return -1;
        }
        return (
          (a.stats.cpu ? a.stats.cpu.systemLoad / a.stats.cpu.cores : 0) -
          (b.stats.cpu ? b.stats.cpu.systemLoad / b.stats.cpu.cores : 0)
        );
      });
  }

  public getNode(guildId: string): ClusterNode {
    let node = this.nodes.find((nodeX) => nodeX.players.has(guildId));
    if (!node) {
      node = this.sort().find((nodeX) => this.filter(nodeX, guildId));
    }

    if (node) {
      return node;
    }

    throw new Error(
      "unable to find appropriate node; please check your filter"
    );
  }

  public has(guildId: string): boolean {
    return this.nodes.some((node) => node.players.has(guildId));
  }

  public get(guildId: string): Player<ClusterNode> {
    return this.getNode(guildId).players.get(guildId);
  }

  public voiceStateUpdate(state: VoiceStateUpdate): Promise<boolean> {
    return this.getNode(state.guild_id).voiceStateUpdate(state);
  }

  public voiceServerUpdate(server: VoiceServerUpdate): Promise<boolean> {
    return this.getNode(server.guild_id).voiceServerUpdate(server);
  }
}
