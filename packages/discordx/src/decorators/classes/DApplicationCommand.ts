import type {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  LocalizationMap,
  PermissionResolvable,
} from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import type { ApplicationCommandDataEx, Client, IGuild } from "../../index.js";
import { DApplicationCommandOption, resolveIGuilds } from "../../index.js";
import { Method } from "./Method.js";

type CreateStructure = {
  botIds?: string[];
  defaultMemberPermissions?: PermissionResolvable | null;
  description: string;
  descriptionLocalizations?: LocalizationMap | null;
  dmPermission?: boolean;
  guilds?: IGuild[];
  name: string;
  nameLocalizations?: LocalizationMap | null;
  type: ApplicationCommandType;
};

/**
 * @category Decorator
 */
export class DApplicationCommand extends Method {
  private _botIds: string[];
  private _name: string;
  private _nameLocalizations: LocalizationMap | null;
  private _description: string;
  private _descriptionLocalizations: LocalizationMap | null;
  private _defaultMemberPermissions: PermissionResolvable | null;
  private _dmPermission: boolean;
  private _guilds: IGuild[];
  private _group?: string;
  private _options: DApplicationCommandOption[] = [];
  private _subgroup?: string;
  private _type: ApplicationCommandType;

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get defaultMemberPermissions(): PermissionResolvable | null {
    return this._defaultMemberPermissions;
  }
  set defaultMemberPermissions(value: PermissionResolvable | null) {
    this._defaultMemberPermissions = value;
  }

  get dmPermission(): boolean {
    return this._dmPermission;
  }
  set dmPermission(value: boolean) {
    this._dmPermission = value;
  }

  get descriptionLocalizations(): LocalizationMap | null {
    return this._descriptionLocalizations;
  }
  set descriptionLocalizations(value: LocalizationMap | null) {
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

  get nameLocalizations(): LocalizationMap | null {
    return this._nameLocalizations;
  }
  set nameLocalizations(value: LocalizationMap | null) {
    this._nameLocalizations = value;
  }

  get options(): DApplicationCommandOption[] {
    return this._options;
  }
  set options(value: DApplicationCommandOption[]) {
    this._options = value;
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

  protected constructor(data: CreateStructure) {
    super();
    this._name = data.name;
    this._type = data.type;
    this._description = data.description;
    this._guilds = data.guilds ?? [];
    this._botIds = data.botIds ?? [];
    this._descriptionLocalizations = data.descriptionLocalizations ?? null;
    this._nameLocalizations = data.nameLocalizations ?? null;
    this._dmPermission = data.dmPermission ?? true;
    this._defaultMemberPermissions = data.defaultMemberPermissions ?? null;
  }

  static create(data: CreateStructure): DApplicationCommand {
    return new DApplicationCommand(data);
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

  toSubCommand(): DApplicationCommandOption {
    const option = DApplicationCommandOption.create({
      description: this.description,
      name: this.name,
      required: true,
      type: ApplicationCommandOptionType.Subcommand,
    }).decorate(this.classRef, this.key, this.method, this.from, this.index);

    option.options = this.options;
    return option;
  }

  toJSON(): ApplicationCommandDataEx {
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

    const data: ApplicationCommandDataEx = {
      defaultMemberPermissions: this.defaultMemberPermissions,
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      dmPermission: this.dmPermission,
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      options: options,
      type: this.type,
    };

    return data;
  }

  parseParams(interaction: ChatInputCommandInteraction): unknown[] {
    return [...this.options].reverse().map((op) => {
      switch (op.type) {
        case ApplicationCommandOptionType.Attachment:
          return interaction.options.getAttachment(op.name) ?? undefined;

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
