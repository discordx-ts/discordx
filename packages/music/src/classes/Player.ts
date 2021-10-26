import { Collection, Guild, Snowflake } from "discord.js";
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

  /**
   * get guild queue
   * @param guild
   * @returns
   */
  queue(guild: Guild): Queue {
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
