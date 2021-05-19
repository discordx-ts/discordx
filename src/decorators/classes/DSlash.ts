import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
} from "discord.js";
import { DOption, DDiscord, Client, DGuard } from "../..";
import { Decorator } from "../classes/Decorator";

export class DSlash extends Decorator {
  private _description: string;
  private _name: string;
  private _defaultPermission: boolean = true;
  private _options: DOption[] = [];
  private _permissions: string[] = [];
  private _guards: DGuard[] = [];
  private _guilds: string[];
  private _discord: DDiscord;

  get discord() {
    return this._discord;
  }
  set discord(value: DDiscord) {
    this._discord = value;
  }

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

  get name() {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get description() {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get options() {
    return this._options;
  }
  set options(value: DOption[]) {
    this._options = value;
  }

  get guards() {
    return this._guards;
  }
  set guards(value) {
    this._guards = value;
  }

  protected constructor() {
    super();
  }

  static create(
    name: string,
    description?: string,
    defaultPermission: boolean = true,
    guilds?: string[]
  ) {
    const slash = new DSlash();

    slash.name = name;
    slash.description = description || slash.name;
    slash.defaultPermission = defaultPermission;
    slash.guilds = guilds || Client.slashGuilds;

    return slash;
  }

  toObject(): ApplicationCommandData {
    return {
      name: this.name,
      description: this.description,
      options: this.options.reverse().map((option) => option.toObject()),
      defaultPermission: this.defaultPermission,
    };
  }

  getPermissions(): ApplicationCommandPermissionData[] {
    return this.permissions.map((permission) => ({
      permission: true,
      id: permission,
      type: 1,
    }));
  }
}
