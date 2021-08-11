import { Snowflake } from "discord.js";
import { Client } from "../..";
import { Method } from "./Method";

export class DButtonComponent extends Method {
  private _id: string;
  private _guilds: Snowflake[];
  private _botIds: string[];

  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
  }

  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
  }

  get guilds() {
    return this._guilds;
  }
  set guilds(value) {
    this._guilds = value;
  }

  protected constructor(id: string, guilds?: Snowflake[], botIds?: string[]) {
    super();
    this._id = id;
    this._guilds = guilds ?? Client.slashGuilds;
    this._botIds = botIds ?? [];
  }

  static create(id: string, guilds?: Snowflake[], botIds?: string[]) {
    return new DButtonComponent(id, guilds, botIds);
  }

  parseParams() {
    return [];
  }
}
