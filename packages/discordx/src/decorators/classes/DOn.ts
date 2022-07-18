import type { ClientEvents } from "discord.js";

import type { DiscordEvents } from "../../index.js";
import { Method } from "./Method.js";

type CreateStructure = {
  botIds?: string[];
  event: DiscordEvents;
  once: boolean;
};

/**
 * @category Decorator
 */
export class DOn extends Method {
  protected _event: DiscordEvents;
  protected _once: boolean;
  protected _botIds: string[];

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get event(): keyof ClientEvents {
    return this._event;
  }
  set event(value: DiscordEvents) {
    this._event = value;
  }

  get once(): boolean {
    return this._once;
  }
  set once(value: boolean) {
    this._once = value;
  }

  protected constructor(data: CreateStructure) {
    super();
    this._event = data.event;
    this._once = data.once;
    this._botIds = data.botIds ?? [];
  }

  static create(data: CreateStructure): DOn {
    return new DOn(data);
  }

  isBotAllowed(botId: string): boolean {
    if (!this.botIds.length) {
      return true;
    }

    return this.botIds.includes(botId);
  }

  parseParams(): never[] {
    return [];
  }
}
