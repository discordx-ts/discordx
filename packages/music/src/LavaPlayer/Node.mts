/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseNode from "./base/Node.mjs";
import { BaseNodeOptions } from "./types/index.mjs";

export interface NodeOptions extends BaseNodeOptions {
  send: (guildId: string, packet: any) => any;
}

export default class Node extends BaseNode {
  public send: (guildId: string, packet: any) => any;

  constructor(options: NodeOptions) {
    super(options);
    this.send = options.send;
  }
}
