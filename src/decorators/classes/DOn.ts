import { DiscordEvents } from "../..";
import { EventParams } from "../params/EventParams";
import { Method } from "./Method";

export class DOn extends Method {
  protected _botIds?: string[];
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

  protected constructor() {
    super();
  }

  static create(event: DiscordEvents, once: boolean, params?: EventParams) {
    const on = new DOn();

    on.event = event;
    on.once = once;
    on.botIds = params.botIds;

    return on;
  }

  parseParams() {
    return [];
  }
}
