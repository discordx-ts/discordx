import { DiscordEvents } from "../..";
import { Method } from "./Method";

export class DOn extends Method {
  protected _event!: DiscordEvents;
  protected _once!: boolean;
  protected _botIds!: string[];

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

  static create(event: DiscordEvents, once: boolean, botIds?: string[]) {
    const on = new DOn();

    on._event = event;
    on._once = once;
    on._botIds = botIds ?? [];

    return on;
  }

  parseParams() {
    return [];
  }
}
