/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApplicationCommandData,
  ApplicationCommandType,
  CommandInteraction,
  CommandInteractionOption,
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

  toJSON(): ApplicationCommandData {
    const options = [...this.options]
      .reverse()
      .map((option) => option.toJSON());

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
      name: this.name,
      type: this.type,
    };
  }

  getLastNestedOption(
    options: readonly CommandInteractionOption[]
  ): readonly CommandInteractionOption[] {
    const arrOptions = options;

    if (!arrOptions?.[0]?.options) {
      return arrOptions;
    }

    return this.getLastNestedOption(arrOptions?.[0].options);
  }

  parseParams(interaction: CommandInteraction) {
    const options = this.getLastNestedOption(interaction.options.data);

    return this.options
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((op) => {
        const option = options.find((xp) => xp.name === op.name);
        if (!option) {
          return undefined;
        }

        // GuildChannel | APIInteractionDataResolvedChannel | undefined
        if (option.type === "CHANNEL") {
          return option.channel;
        }

        // GuildMember | APIInteractionDataResolvedGuildMember | User | undefined
        if (option.type === "USER") {
          return option.member ?? option.user;
        }

        // Role | APIRole | undefined
        if (option.type === "ROLE") {
          return option.role;
        }

        // GuildChannel | APIInteractionDataResolvedChannel | Role | APIRole | undefined
        if (option.type === "MENTIONABLE") {
          return option.member ?? option.user ?? option.role;
        }

        // string | number | boolean | undefined
        return option.value;
      });
  }
}
