import { Method } from "./Method.js";

type CreateStructure = {
  botIds?: string[];
  event: string;
  once: boolean;
  rest: boolean;
};

/**
 * @category Decorator
 */
export class DOn extends Method {
  protected _event: string;
  protected _once: boolean;
  protected _rest: boolean;
  protected _botIds: string[];

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get event(): string {
    return this._event;
  }
  set event(value: string) {
    this._event = value;
  }

  get once(): boolean {
    return this._once;
  }
  set once(value: boolean) {
    this._once = value;
  }

  get rest(): boolean {
    return this._rest;
  }
  set rest(value: boolean) {
    this._rest = value;
  }

  protected constructor(data: CreateStructure) {
    super();
    this._event = data.event;
    this._once = data.once;
    this._rest = data.rest;
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
