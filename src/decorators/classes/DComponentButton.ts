import { IGuild } from "../..";
import { Method } from "./Method";

/**
 * @category Decorator
 */
export class DComponentButton extends Method {
  private _id: string;
  private _guilds: IGuild[];
  private _botIds: string[];

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get guilds(): IGuild[] {
    return this._guilds;
  }
  set guilds(value: IGuild[]) {
    this._guilds = value;
  }

  protected constructor(id: string, guilds?: IGuild[], botIds?: string[]) {
    super();
    this._id = id;
    this._guilds = guilds ?? [];
    this._botIds = botIds ?? [];
  }

  static create(
    id: string,
    guilds?: IGuild[],
    botIds?: string[]
  ): DComponentButton {
    return new DComponentButton(id, guilds, botIds);
  }

  parseParams(): never[] {
    return [];
  }
}
