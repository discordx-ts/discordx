/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { BaseNode } from "../base/base-node.js";
import { GuildPlayer } from "./guild-player.js";

export default class GuildPlayerStore<
  T extends BaseNode = BaseNode,
> extends Map<string, GuildPlayer<T>> {
  public readonly node: T;

  constructor(node: T) {
    super();
    this.node = node;
  }

  public get(key: string): GuildPlayer<T> {
    let player = super.get(key);
    if (!player) {
      player = new GuildPlayer(this.node, key);
      this.set(key, player);
    }

    return player;
  }
}
