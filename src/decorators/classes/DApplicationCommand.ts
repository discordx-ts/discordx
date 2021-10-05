/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApplicationCommandData,
  ApplicationCommandType,
  CommandInteraction,
  Guild,
} from "discord.js";

import {
  DApplicationCommandOption,
  IGuild,
  IPermissions,
  resolveIPermission,
} from "../..";
import { Method } from "./Method";

/**
 * @category Decorator
 */
export class DApplicationCommand extends Method {
  private _name: string;
  private _description: string;
  private _type: ApplicationCommandType;
  private _defaultPermission: boolean;
  private _options: DApplicationCommandOption[] = [];
  private _permissions: IPermissions[] = [];
  private _guilds: IGuild[];
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

  get options() {
    return this._options;
  }
  set options(value: DApplicationCommandOption[]) {
    value.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    this._options = value;
  }

  protected constructor(
    name: string,
    type: ApplicationCommandType,
    description?: string,
    defaultPermission?: boolean,
    guilds?: IGuild[],
    botIds?: string[]
  ) {
    super();
    this._name = name;
    this._type = type;
    this._description = description ?? this.name;
    this._defaultPermission = defaultPermission ?? true;
    this._guilds = guilds ?? [];
    this._botIds = botIds ?? [];
  }

  static create(
    name: string,
    type: ApplicationCommandType,
    description?: string,
    defaultPermission?: boolean,
    guilds?: IGuild[],
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

  permissionsPromise(guild: Guild | null) {
    return resolveIPermission(guild, this.permissions);
  }

  toSubCommand() {
    const option = DApplicationCommandOption.create(
      this.name,
      "SUB_COMMAND",
      this.description
    ).decorate(this.classRef, this.key, this.method, this.from, this.index);
    option.options = this.options;

    return option;
  }

  toJSON(config?: { channelString: boolean }): ApplicationCommandData {
    const options = [...this.options]
      .reverse()
      .map((option) => option.toJSON(config));

    if (this.type === "CHAT_INPUT") {
      return {
        defaultPermission: this.defaultPermission,
        description: this.description,
        name: this.name,
        options: options,
        type: this.type,
      };
    }

    return {
      defaultPermission: this.defaultPermission,
      description: "",
      name: this.name,
      options: [],
      type: this.type,
    };
  }

  parseParams(interaction: CommandInteraction) {
    return this.options.map((op) => {
      switch (op.type) {
        case "STRING":
          return interaction.options.getString(op.name);
      
        case "BOOLEAN":
          return interaction.options.getBoolean(op.name);
        
        case "NUMBER":
          return interaction.options.getNumber(op.name);
        
        case "INTEGER":
          return interaction.options.getInteger(op.name);
        
        case "ROLE":
          return interaction.options.getRole(op.name);
        
        case "CHANNEL":
          return interaction.options.getChannel(op.name);
        
        case "MENTIONABLE":
          return interaction.options.getMentionable(op.name);
        
        case "USER":
          return interaction.options.getUser(op.name);
        
        default:
          return interaction.options.getString(op.name);
      }
    });
  }
}
