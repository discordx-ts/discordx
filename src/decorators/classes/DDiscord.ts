import { Decorator } from "./Decorator";
import {
  DGuard,
} from "../..";
import { DIService } from "../../logic";

export class DDiscord extends Decorator {
  private _guards: DGuard[] = [];
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
    return DIService.instance.getService(this.from);
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
