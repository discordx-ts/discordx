import { Collection, Guild, Snowflake } from "discord.js";
import { PlayerEventArgOf, PlayerEvents, Queue } from "..";
import { EventEmitter } from "node:events";

/**
 * Music player
 */
export class Player extends EventEmitter {
  public queues = new Collection<Snowflake, Queue>();

  constructor() {
    super();
  }

  public on<Q extends Queue, T extends keyof PlayerEvents<Q>>(
    event: T,
    handler: PlayerEventArgOf<Q, T>
  ): this {
    return super.on(event, handler);
  }

  /**
   * get guild queue
   * @param guild
   * @returns
   */
  public queue<T extends Queue>(guild: Guild, customQueue?: T): T {
    const queue = this.queues.get(guild.id) as T | undefined;

    // return queue if already exist
    if (queue) {
      return queue;
    }

    // create new queue
    class MyQueue extends Queue {}
    const queueClass = customQueue
      ? customQueue
      : (new MyQueue(this, guild) as T);

    // store queue
    this.queues.set(guild.id, queueClass);

    // return queue
    return queueClass;
  }
}
