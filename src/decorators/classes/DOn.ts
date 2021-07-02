import { DiscordEvents } from "../..";
import { Method } from "./Method";

export class DOn extends Method {
  protected _botIds: string[];
  protected _event: DiscordEvents;
  protected _once: boolean;

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

  protected constructor(event, once, botIds) {
    super();
    this._event = event;
    this._once = once;
    this._botIds = botIds;
  }

  static create(event: DiscordEvents, once: boolean, botIds: string[]) {
    return new DOn(event, once, botIds);
  }

  parseParams() {
    return [];
  }
}
