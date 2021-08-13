import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  CommandInteraction,
  CommandInteractionOption,
  Snowflake,
  ApplicationCommandType,
} from "discord.js";
import { DApplicationCommandOption, Client } from "../..";
import { Method } from "./Method";

export class DApplicationCommand extends Method {
  private _name: string;
  private _description: string;
  private _type: ApplicationCommandType;
  private _defaultPermission: boolean;
  private _slashOptions: DApplicationCommandOption[] = [];
  private _permissions: ApplicationCommandPermissionData[] = [];
  private _guilds: Snowflake[];
  private _group?: string;
  private _subgroup?: string;
  private _botIds: string[];

  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }

  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
  }

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

  get slashOptions() {
    return this._slashOptions;
  }
  set slashOptions(value: DApplicationCommandOption[]) {
    this._slashOptions = value;
  }

  protected constructor(
    name: string,
    type: ApplicationCommandType,
    description?: string,
    defaultPermission?: boolean,
    guilds?: Snowflake[],
    botIds?: string[]
  ) {
    super();
    this._name = name;
    this._type = type;
    this._description = description ?? this.name;
    this._defaultPermission = defaultPermission ?? true;
    this._guilds = guilds ?? Client.slashGuilds;
    this._botIds = botIds ?? [];
  }

  static create(
    name: string,
    type: ApplicationCommandType,
    description?: string,
    defaultPermission?: boolean,
    guilds?: Snowflake[],
    botIds?: string[]
  ) {
    return new DApplicationCommand(
      name,
      type,
      description,
      defaultPermission,
      guilds,
      botIds
    );
  }

  toSubCommand() {
    const option = DApplicationCommandOption.create(
      this.name,
      "SUB_COMMAND",
      this.description
    ).decorate(this.classRef, this.key, this.method, this.from, this.index);
    option.options = this.slashOptions;

    return option;
  }

  toObject(): ApplicationCommandData {
    const options = [...this.slashOptions]
      .reverse()
      .map((option) => option.toObject());

    if (this.type === "CHAT_INPUT") {
      return {
        name: this.name,
        description: this.description,
        options: options,
        defaultPermission: this.defaultPermission,
        type: this.type,
      };
    }

    return {
      name: this.name,
      defaultPermission: this.defaultPermission,
      type: this.type,
    };
  }

  getLastNestedOption(
    options: CommandInteractionOption[]
  ): CommandInteractionOption[] {
    const arrOptions = Array.from(options?.values());

    if (!arrOptions?.[0]?.options) {
      return arrOptions;
    }

    return this.getLastNestedOption(arrOptions?.[0].options);
  }

  parseParams(interaction: CommandInteraction) {
    const options = this.getLastNestedOption(
      Array.from(interaction.options.data.values())
    );

    return this.slashOptions
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((op) => options.find((o) => o.name === op.name)?.value);
  }
}
