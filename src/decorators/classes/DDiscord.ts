import { Decorator } from "./Decorator";
import { DGuard, DSlash, DIService, DOn } from "../..";
import { PermissionType } from "../../types";

export class DDiscord extends Decorator {
  private _guards: DGuard[] = [];
  private _slashes: DSlash[] = [];
  private _events: DOn[] = [];
  private _description?: string;
  private _name: string;
  private _defaultPermission = true;
  private _permissions: { id: string; type: PermissionType }[] = [];
  private _guilds: string[] = [];

  get permissions() {
    return this._permissions;
  }
  set permissions(value) {
    this._permissions = value;
  }

  get guilds() {
    return this._guilds;
  }
  set guilds(value) {
    this._guilds = value;
  }

  get defaultPermission() {
    return this._defaultPermission;
  }
  set defaultPermission(value) {
    this._defaultPermission = value;
  }

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

  get slashes() {
    return this._slashes;
  }
  set slashes(value) {
    this._slashes = value;
  }

  get events() {
    return this._events;
  }
  set events(value) {
    this._events = value;
  }

  get instance() {
    return DIService.instance.getService(this.from);
  }

  protected constructor(name: string) {
    super();
    this._name = name;
  }

  static create(name: string) {
    return new DDiscord(name);
  }
}
