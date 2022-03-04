import type {
  ApplicationCommandData,
  ApplicationCommandPermissions,
  ChatInputCommandInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember,
  Role,
  User,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import type {
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
} from "discord-api-types/v9";

import type {
  ApplicationCommandDataX,
  ApplicationCommandMixin,
  ApplicationGuildMixin,
  IDefaultPermission,
  IGuild,
  IPermissions,
} from "../../index.js";
import { DApplicationCommandOption, resolveIPermissions } from "../../index.js";
import { Method } from "./Method.js";

/**
 * @category Decorator
 */
export class DApplicationCommand extends Method {
  private _name: string;
  private _description: string;
  private _type: ApplicationCommandType;
  private _defaultPermission: IDefaultPermission;
  private _options: DApplicationCommandOption[] = [];
  private _permissions: IPermissions[] = [];
  private _guilds: IGuild[];
  private _group?: string;
  private _subgroup?: string;
  private _botIds: string[];

  get type(): ApplicationCommandType {
    return this._type;
  }
  set type(value: ApplicationCommandType) {
    this._type = value;
  }

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get group(): string | undefined {
    return this._group;
  }
  set group(value: string | undefined) {
    this._group = value;
  }

  get subgroup(): string | undefined {
    return this._subgroup;
  }
  set subgroup(value: string | undefined) {
    this._subgroup = value;
  }

  get permissions(): IPermissions[] {
    return this._permissions;
  }
  set permissions(value: IPermissions[]) {
    this._permissions = value;
  }

  get guilds(): IGuild[] {
    return this._guilds;
  }
  set guilds(value: IGuild[]) {
    this._guilds = value;
  }

  get defaultPermission(): IDefaultPermission {
    return this._defaultPermission;
  }
  set defaultPermission(value: IDefaultPermission) {
    this._defaultPermission = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get options(): DApplicationCommandOption[] {
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
    this._description = description ?? name.toLocaleLowerCase();
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
  ): DApplicationCommand {
    return new DApplicationCommand(
      name,
      type,
      description,
      defaultPermission,
      guilds,
      botIds
    );
  }

  resolvePermissions(
    guild: Guild,
    command: ApplicationCommandMixin
  ): Promise<ApplicationCommandPermissions[]> {
    return resolveIPermissions(guild, command, this.permissions);
  }

  toSubCommand(): DApplicationCommandOption {
    const option = DApplicationCommandOption.create(
      this.name,
      undefined,
      undefined,
      this.description,
      undefined,
      undefined,
      undefined,
      undefined,
      ApplicationCommandOptionType.Subcommand
    ).decorate(this.classRef, this.key, this.method, this.from, this.index);
    option.options = this.options;

    return option;
  }

  async toJSON(
    command?: ApplicationGuildMixin
  ): Promise<ApplicationCommandData> {
    if (this.type !== ApplicationCommandType.ChatInput) {
      const data: ApplicationCommandData = {
        defaultPermission:
          typeof this.defaultPermission === "boolean"
            ? this.defaultPermission
            : await this.defaultPermission.resolver(command),
        description: "",
        name: this.name,
        options: [],
        type: this.type,
      };
      return data;
    }

    const options = [...this.options]
      .reverse()
      .sort((a, b) => {
        if (
          (a.type === ApplicationCommandOptionType.Subcommand ||
            a.type === ApplicationCommandOptionType.SubcommandGroup) &&
          (b.type === ApplicationCommandOptionType.Subcommand ||
            b.type === ApplicationCommandOptionType.SubcommandGroup)
        ) {
          return a.name < b.name ? -1 : 1;
        }

        return 0;
      })
      .map((option) => option.toJSON());

    const data: ApplicationCommandDataX = {
      defaultPermission:
        typeof this.defaultPermission === "boolean"
          ? this.defaultPermission
          : await this.defaultPermission.resolver(command),
      description: this.description,
      name: this.name,
      options: options,
      type: this.type,
    };

    return data as unknown as ApplicationCommandData;
  }

  parseParams(
    interaction: ChatInputCommandInteraction
  ): (
    | string
    | number
    | boolean
    | Role
    | APIRole
    | GuildMember
    | APIInteractionDataResolvedChannel
    | GuildBasedChannel
    | APIInteractionDataResolvedGuildMember
    | User
    | undefined
  )[] {
    return [...this.options].reverse().map((op) => {
      switch (op.type) {
        case ApplicationCommandOptionType.String:
          return interaction.options.getString(op.name) ?? undefined;

        case ApplicationCommandOptionType.Boolean:
          return interaction.options.getBoolean(op.name) ?? undefined;

        case ApplicationCommandOptionType.Number:
          return interaction.options.getNumber(op.name) ?? undefined;

        case ApplicationCommandOptionType.Integer:
          return interaction.options.getInteger(op.name) ?? undefined;

        case ApplicationCommandOptionType.Role:
          return interaction.options.getRole(op.name) ?? undefined;

        case ApplicationCommandOptionType.Channel:
          return interaction.options.getChannel(op.name) ?? undefined;

        case ApplicationCommandOptionType.Mentionable:
          return interaction.options.getMentionable(op.name) ?? undefined;

        case ApplicationCommandOptionType.User:
          return (
            interaction.options.getMember(op.name) ??
            interaction.options.getUser(op.name) ??
            undefined
          );

        default:
          return interaction.options.getString(op.name) ?? undefined;
      }
    });
  }
}
