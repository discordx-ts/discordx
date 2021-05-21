import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  ApplicationCommandPermissionData,
  CommandInteraction,
  CommandInteractionOption,
} from "discord.js";
import { DOption, Client, SubValueType } from "../..";
import { Method } from "./Method";

export class DSlash extends Method {
  private _description: string;
  private _name: string;
  private _defaultPermission: boolean = true;
  private _options: DOption[] = [];
  private _permissions: string[] = [];
  private _guilds: string[];
  private _group: string;
  private _subgroup: string;

  get group() {
    return this._group;
  }
  set group(value) {
    this._group = value;
  }

  get subgroup() {
    return this._subgroup;
  }
  set subgroup(value) {
    this._subgroup = value;
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

  toSubCommand() {
    const option = DOption.create(
      this.name,
      "SUB_COMMAND"
    ).decorate(
      this.classRef,
      this.key,
      this.method,
      this.from,
      this.index
    );
    option.options = this.options;

    return option;
  }

  toObject(): ApplicationCommandData {
    const options = this.options.reverse().map((option) => option.toObject());
    
    return {
      name: this.name,
      description: this.description,
      options: options,
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

  getLastNestedOption(options: CommandInteractionOption[]) {
    if (!options[0].options) {
      return options;
    }
    return this.getLastNestedOption(options[0].options);
  }

  parseParams(interaction: CommandInteraction) {
    return this.getLastNestedOption(interaction.options).map((option) => option.value);
  }
}
