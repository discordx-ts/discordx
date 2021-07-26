import { DiscordEvents } from "../..";
import { Method } from "./Method";

export class DOn extends Method {
  protected _event: DiscordEvents;
  protected _once: boolean;
  protected _botIds: string[];

  get botIds() {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get event() {
    return this._event;
  }
  set event(value: DiscordEvents) {
    this._event = value;
  }

  get once() {
    return this._once;
  }
  set once(value: boolean) {
    this._once = value;
  }

  protected constructor(
    event: DiscordEvents,
    once: boolean,
    botIds?: string[]
  ) {
    super();
    this._event = event;
    this._once = once;
    this._botIds = botIds ?? [];
  }

  static create(event: DiscordEvents, once: boolean, botIds?: string[]) {
    return new DOn(event, once, botIds);
  }

  parseParams() {
    return [];
  }
}
