import { DiscordEvents } from "../..";
import { Method } from "./Method";

export class DOn extends Method {
  // required fix
  protected _botIds!: string[];
  protected _event!: DiscordEvents;
  protected _once!: boolean;

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

  static create(event: DiscordEvents, once: boolean, botIds: string[]) {
    const on = new DOn();

    on._event = event;
    on._once = once;
    on._botIds = botIds;

    return on;
  }

  parseParams() {
    return [];
  }
}
