import { Client } from "../..";
import { Method } from "./Method";

export class DButton extends Method {
  private _id!: string;
  private _guilds!: string[];
  private _botIds!: string[];

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

  protected constructor() {
    super();
  }

  static create(id: string, guilds?: string[], botIds?: string[]) {
    const button = new DButton();

    button.id = id;
    button.guilds = guilds ?? Client.slashGuilds;
    button.botIds = botIds ?? [];

    return button;
  }

  parseParams() {
    return [];
  }
}
