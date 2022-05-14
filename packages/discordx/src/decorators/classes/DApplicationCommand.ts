import type {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  ApplicationCommandPermissions,
  ApplicationCommandType,
  CommandInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember,
  MessageAttachment,
  Role,
  User,
} from "discord.js";
import type {
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  LocalizationMap,
} from "discord-api-types/v9";

import type {
  ApplicationCommandMixin,
  ApplicationGuildMixin,
  Client,
  IDefaultPermission,
  IGuild,
  IPermissions,
} from "../../index.js";
import {
  DApplicationCommandOption,
  resolveIGuilds,
  resolveIPermissions,
} from "../../index.js";
import { Method } from "./Method.js";

/**
 * @category Decorator
 */
export class DApplicationCommand extends Method {
  private _botIds: string[];
  private _name: string;
  private _nameLocalizations?: LocalizationMap;
  private _defaultPermission: IDefaultPermission;
  private _description: string;
  private _descriptionLocalizations?: LocalizationMap;
  private _guilds: IGuild[];
  private _group?: string;
  private _options: DApplicationCommandOption[] = [];
  private _permissions: IPermissions[] = [];
  private _subgroup?: string;
  private _type: ApplicationCommandType;

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get defaultPermission(): IDefaultPermission {
    return this._defaultPermission;
  }
  set defaultPermission(value: IDefaultPermission) {
    this._defaultPermission = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get descriptionLocalizations(): LocalizationMap | undefined {
    return this._descriptionLocalizations;
  }
  set descriptionLocalizations(value: LocalizationMap | undefined) {
    this._descriptionLocalizations = value;
  }

  get group(): string | undefined {
    return this._group;
  }
  set group(value: string | undefined) {
    this._group = value;
  }

  get guilds(): IGuild[] {
    return this._guilds;
  }
  set guilds(value: IGuild[]) {
    this._guilds = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get nameLocalizations(): LocalizationMap | undefined {
    return this._nameLocalizations;
  }
  set nameLocalizations(value: LocalizationMap | undefined) {
    this._nameLocalizations = value;
  }

  get options(): DApplicationCommandOption[] {
    return this._options;
  }
  set options(value: DApplicationCommandOption[]) {
    this._options = value;
  }

  get permissions(): IPermissions[] {
    return this._permissions;
  }
  set permissions(value: IPermissions[]) {
    this._permissions = value;
  }

  get subgroup(): string | undefined {
    return this._subgroup;
  }
  set subgroup(value: string | undefined) {
    this._subgroup = value;
  }

  get type(): ApplicationCommandType {
    return this._type;
  }
  set type(value: ApplicationCommandType) {
    this._type = value;
  }

  protected constructor(
    name: string,
    type: ApplicationCommandType,
    description?: string,
    defaultPermission?: boolean,
    guilds?: IGuild[],
    botIds?: string[],
    descriptionLocalizations?: LocalizationMap,
    nameLocalizations?: LocalizationMap
  ) {
    super();
    this._name = name;
    this._type = type;
    this._description = description ?? this.name;
    this._defaultPermission = defaultPermission ?? true;
    this._guilds = guilds ?? [];
    this._botIds = botIds ?? [];
    this._descriptionLocalizations = descriptionLocalizations;
    this._nameLocalizations = nameLocalizations;
  }

  static create(
    name: string,
    type: ApplicationCommandType,
    description?: string,
    defaultPermission?: boolean,
    guilds?: IGuild[],
    botIds?: string[],
    descriptionLocalizations?: LocalizationMap,
    nameLocalizations?: LocalizationMap
  ): DApplicationCommand {
    return new DApplicationCommand(
      name,
      type,
      description,
      defaultPermission,
      guilds,
      botIds,
      descriptionLocalizations,
      nameLocalizations
    );
  }

  isBotAllowed(botId: string): boolean {
    if (!this.botIds.length) {
      return true;
    }

    return this.botIds.includes(botId);
  }

  async getGuilds(client: Client): Promise<string[]> {
    const guilds = await resolveIGuilds(client, this, [
      ...client.botGuilds,
      ...this.guilds,
    ]);

    return guilds;
  }

  async isGuildAllowed(
    client: Client,
    guildId: string | null
  ): Promise<boolean> {
    if (!guildId) {
      return true;
    }

    const guilds = await this.getGuilds(client);

    if (!guilds.length) {
      return true;
    }

    return guilds.includes(guildId);
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
      "SUB_COMMAND"
    ).decorate(this.classRef, this.key, this.method, this.from, this.index);
    option.options = this.options;

    return option;
  }

  async toJSON(
    command?: ApplicationGuildMixin
  ): Promise<ApplicationCommandData> {
    if (this.type !== "CHAT_INPUT") {
      const data: ApplicationCommandData = {
        defaultPermission:
          typeof this.defaultPermission === "boolean"
            ? this.defaultPermission
            : await this.defaultPermission.resolver(command),
        description: "",
        name: this.name,
        nameLocalizations:
          this.nameLocalizations ?? (null as unknown as undefined),
        options: [],
        type: this.type,
      };
      return data;
    }

    const options = [...this.options]
      .reverse()
      .sort((a, b) => {
        if (
          (a.type === "SUB_COMMAND" || a.type === "SUB_COMMAND_GROUP") &&
          (b.type === "SUB_COMMAND" || b.type === "SUB_COMMAND_GROUP")
        ) {
          return a.name < b.name ? -1 : 1;
        }

        return 0;
      })
      .map((option) => option.toJSON());

    const data: ApplicationCommandData = {
      defaultPermission:
        typeof this.defaultPermission === "boolean"
          ? this.defaultPermission
          : await this.defaultPermission.resolver(command),
      description: this.description,
      descriptionLocalizations:
        this.descriptionLocalizations ?? (null as unknown as undefined),
      name: this.name,
      nameLocalizations:
        this.nameLocalizations ?? (null as unknown as undefined),
      options: options as ApplicationCommandOptionData[],
      type: this.type,
    };

    return data as unknown as ApplicationCommandData;
  }

  parseParams(
    interaction: CommandInteraction
  ): (
    | string
    | number
    | boolean
    | Role
    | APIRole
    | GuildMember
    | MessageAttachment
    | APIInteractionDataResolvedChannel
    | GuildBasedChannel
    | APIInteractionDataResolvedGuildMember
    | User
    | undefined
  )[] {
    return [...this.options].reverse().map((op) => {
      switch (op.type) {
        case "ATTACHMENT":
          return interaction.options.getAttachment(op.name) ?? undefined;

        case "STRING":
          return interaction.options.getString(op.name) ?? undefined;

        case "BOOLEAN":
          return interaction.options.getBoolean(op.name) ?? undefined;

        case "NUMBER":
          return interaction.options.getNumber(op.name) ?? undefined;

        case "INTEGER":
          return interaction.options.getInteger(op.name) ?? undefined;

        case "ROLE":
          return interaction.options.getRole(op.name) ?? undefined;

        case "CHANNEL":
          return interaction.options.getChannel(op.name) ?? undefined;

        case "MENTIONABLE":
          return interaction.options.getMentionable(op.name) ?? undefined;

        case "USER":
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
