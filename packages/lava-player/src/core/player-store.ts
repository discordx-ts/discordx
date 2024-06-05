/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { BaseNode } from "../base/base-node.js";
import { Player } from "./player.js";

export default class PlayerStore<T extends BaseNode = BaseNode> extends Map<
  string,
  Player<T>
> {
  public readonly node: T;

  constructor(node: T) {
    super();
    this.node = node;
  }

  public get(key: string): Player<T> {
    let player = super.get(key);
    if (!player) {
      player = new Player(this.node, key);
      this.set(key, player);
    }

    return player;
  }
}
