import { Collection, Guild, Snowflake } from "discord.js";
import { PlayerEventArgOf, PlayerEvents } from "..";
import { EventEmitter } from "node:events";
import { Queue } from ".";

/**
 * Music player
 */
export class Player extends EventEmitter {
  public queues = new Collection<Snowflake, Queue>();

  constructor() {
    super();
  }

  public on<T extends keyof PlayerEvents>(
    event: T,
    handler: (...args: PlayerEventArgOf<T>[]) => void
  ): this {
    return super.on(event, handler);
  }

  /**
   * get guild queue
   * @param guild
   * @returns
   */
  public queue(guild: Guild): Queue {
    const queue = this.queues.get(guild.id);

    // return queue if already exist
    if (queue) {
      return queue;
    }

    // create new queue
    const newQueue = new Queue(this, guild);

    // store queue
    this.queues.set(guild.id, newQueue);

    // return queue
    return newQueue;
  }
}
