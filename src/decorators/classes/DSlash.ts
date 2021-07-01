import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  CommandInteraction,
  CommandInteractionOption,
  Snowflake,
} from "discord.js";
import { DOption, Client, PermissionType } from "../..";
import { Method } from "./Method";

export class DSlash extends Method {
  private _description!: string;
  private _name!: string;
  private _defaultPermission = true;
  private _options: DOption[] = [];
  private _permissions: { id: string; type: PermissionType }[] = [];
  private _guilds!: string[];
  private _botIds!: string[];
  private _group!: string;
  private _subgroup!: string;

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

  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
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
    defaultPermission = true,
    guilds?: string[],
    botIds?: string[]
  ) {
    const slash = new DSlash();

    slash.name = name.toLowerCase();
    slash.description = description || slash.name;
    slash.defaultPermission = defaultPermission;
    slash.guilds = guilds || Client.slashGuilds;
    slash.botIds = botIds ?? [];

    return slash;
  }

  toSubCommand() {
    const option = DOption.create(
      this.name,
      "SUB_COMMAND",
      this.description,
      false,
      0 // required fix
    ).decorate(this.classRef, this.key, this.method, this.from, this.index);
    option.options = this.options;

    return option;
  }

  toObject(): ApplicationCommandData {
    const options = [...this.options]
      .reverse()
      .map((option) => option.toObject());

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
      id: permission.id as Snowflake,
      type: permission.type,
    }));
  }

  getLastNestedOption(
    options: Map<string, CommandInteractionOption>
  ): CommandInteractionOption[] {
    const arrOptions = Array.from(options?.values());

    if (!arrOptions?.[0]?.options) {
      return arrOptions;
    }

    return this.getLastNestedOption(arrOptions?.[0].options);
  }

  parseParams(interaction: CommandInteraction) {
    const options = this.getLastNestedOption(interaction.options);

    return this.options
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((op) => options.find((o) => o.name === op.name)?.value);
  }
}
