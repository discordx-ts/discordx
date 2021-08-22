/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  ApplicationCommandType,
  CommandInteraction,
  Snowflake,
} from "discord.js";

import { Client, DApplicationCommandOption } from "../..";
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

  get options() {
    return this._options;
  }
  set options(value: DApplicationCommandOption[]) {
    this._options = value;
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
    this._guilds = guilds ?? Client.botGuilds;
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
    option.options = this.options;

    return option;
  }

  toObject(): ApplicationCommandData {
    const options = [...this.options]
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

  parseParams(interaction: CommandInteraction) {
    return this.options
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((op) => {
        const option = interaction.options.get(op.name);
        console.log(option);
        return option?.type === "CHANNEL"
          ? // GuildChannel | APIInteractionDataResolvedChannel | undefined
            option.channel
          : option?.type === "USER"
          ? // GuildMember | APIInteractionDataResolvedGuildMember | User | undefined
            option.member ?? option.user
          : option?.type === "ROLE"
          ? // Role | APIRole | undefined
            option.role
          : option?.type === "MENTIONABLE"
          ? // GuildChannel | APIInteractionDataResolvedChannel | Role | APIRole | undefined
            option.member ?? option.user ?? option.role
          : // string | number | boolean | undefined
            option?.value;
      });
  }
}
