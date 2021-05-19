import { Decorator } from "./Decorator";
import {
  DiscordInfos,
  DGuard,
} from "../..";

export class DDiscord extends Decorator {
  private _guards: DGuard[] = [];
  private _instance?: Function;
  private _description: string;
  private _name: string;

  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get guards() {
    return this._guards;
  }
  set guards(value) {
    this._guards = value;
  }

  get instance() {
    return this._instance;
  }

  get discordInfos(): DiscordInfos {
    return {
      name: this.name,
      description: this.description
    };
  }

  protected constructor() {
    super();
  }

  static create(name: string) {
    const discord = new DDiscord();
  
    discord.name = name;

    return discord;
  }
}
