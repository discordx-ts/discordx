/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApplicationCommandPermissionData, Snowflake } from "discord.js";
import {
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DGuard,
  DIService,
  DOn,
  DSimpleCommand,
} from "../..";
import { Decorator } from "./Decorator";

export class DDiscord extends Decorator {
  private _name: string;
  private _description: string;
  private _guards: DGuard[] = [];
  private _buttonComponents: DComponentButton[] = [];
  private _selectMenus: DComponentSelectMenu[] = [];
  private _applicationCommands: DApplicationCommand[] = [];
  private _simpleCommands: DSimpleCommand[] = [];
  private _events: DOn[] = [];
  private _defaultPermission = true;
  private _permissions: ApplicationCommandPermissionData[] = [];
  private _guilds: Snowflake[] = [];
  private _botIds: string[] = [];

  get permissions() {
    return this._permissions;
  }
  set permissions(value) {
    this._permissions = value;
  }

  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
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

  get applicationCommands() {
    return this._applicationCommands;
  }
  set applicationCommands(value) {
    this._applicationCommands = value;
  }

  get simpleCommands() {
    return this._simpleCommands;
  }
  set simpleCommands(value) {
    this._simpleCommands = value;
  }

  get buttons() {
    return this._buttonComponents;
  }
  set buttons(value) {
    this._buttonComponents = value;
  }

  get selectMenus() {
    return this._selectMenus;
  }
  set selectMenus(value) {
    this._selectMenus = value;
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

  protected constructor(name: string, description?: string) {
    super();
    this._name = name;
    this._description = description ?? name;
  }

  static create(name: string, description?: string) {
    return new DDiscord(name, description);
  }
}
