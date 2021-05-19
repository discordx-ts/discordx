import { ApplicationCommandData, ApplicationCommandPermissionData } from "discord.js";
import {
  InfosType,
  DOption,
  DDiscord,
  Client
} from "../..";
import { Decorator } from "../classes/Decorator";

export class DSlash<IT extends InfosType = any> extends Decorator {
  private _infos: IT = {} as any;
  private _discord: DDiscord;
  private _defaultPermission: boolean = true; 
  private _options: DOption[] = [];
  private _permissions: string[] = []; 
  private _guilds: string[];

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

  get discord() {
    return this._discord;
  }
  set discord(value) {
    this._discord = value;
  }

  get name() {
    return this._infos.name;
  }
  set name(value: string) {
    this._infos.name = value;
  }

  get description() {
    return this._infos.description;
  }
  set description(value: string) {
    this._infos.description = value;
  }

  get options() {
    return this._options;
  }
  set options(value: DOption[]) {
    this._options = value;
  }

  static createSlash(
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
      defaultPermission: this.defaultPermission
    };
  }

  getPermissions(): ApplicationCommandPermissionData[] {
    return this.permissions.map((permission) => ({
      permission: true,
      id: permission,
      type: 1
    }));
  }
}
