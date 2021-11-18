import BaseNode from "../base/Node.mjs";
import Player from "./Player.mjs";

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
