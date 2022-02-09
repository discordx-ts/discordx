import type { ComponentTypeX, IGuild } from "../../index.js";
import { Method } from "./Method.js";

/**
 * @category Decorator
 */
export class DComponent extends Method {
  private _type: ComponentTypeX;
  private _id: string | RegExp;
  private _guilds: IGuild[];
  private _botIds: string[];

  get type(): ComponentTypeX {
    return this._type;
  }

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get id(): string | RegExp {
    return this._id;
  }
  set id(value: string | RegExp) {
    this._id = value;
  }

  get guilds(): IGuild[] {
    return this._guilds;
  }
  set guilds(value: IGuild[]) {
    this._guilds = value;
  }

  protected constructor(
    type: ComponentTypeX,
    id: string | RegExp,
    guilds?: IGuild[],
    botIds?: string[]
  ) {
    super();
    this._type = type;
    this._id = id;
    this._guilds = guilds ?? [];
    this._botIds = botIds ?? [];
  }

  static create(
    type: ComponentTypeX,
    id: string | RegExp,
    guilds?: IGuild[],
    botIds?: string[]
  ): DComponent {
    return new DComponent(type, id, guilds, botIds);
  }

  isId(text: string): boolean {
    return typeof this.id === "string" ? this.id === text : this.id.test(text);
  }

  parseParams(): never[] {
    return [];
  }
}
