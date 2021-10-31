/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseNode from "./base/Node";
import { BaseNodeOptions } from "./types";

export interface NodeOptions extends BaseNodeOptions {
  send: (guildID: string, packet: any) => any;
}

export default class Node extends BaseNode {
  public send: (guildID: string, packet: any) => any;

  constructor(options: NodeOptions) {
    super(options);
    this.send = options.send;
  }
}
