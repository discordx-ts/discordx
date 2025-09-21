/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  type ApplicationCommandType,
  type ChatInputCommandInteraction,
  type InteractionContextType,
  type LocalizationMap,
  type PermissionResolvable,
} from "discord.js";

import {
  DApplicationCommandOption,
  resolveIGuilds,
  type ApplicationCommandDataEx,
  type Client,
  type IGuild,
} from "../../index.js";
import { Method } from "./Method.js";

interface CreateStructure {
  botIds?: string[];
  contexts?: InteractionContextType[] | null;
  defaultMemberPermissions?: PermissionResolvable | string | null;
  description: string;
  descriptionLocalizations?: LocalizationMap | null;
  dmPermission?: boolean;
  guilds?: IGuild[];
  integrationTypes?: ApplicationIntegrationType[];
  name: string;
  nameLocalizations?: LocalizationMap | null;
  nsfw?: boolean;
  type: ApplicationCommandType;
}

/**
 * @category Decorator
 */
export class DApplicationCommand extends Method {
  private _botIds: string[];
  private _contexts: InteractionContextType[] | null;
  private _defaultMemberPermissions: PermissionResolvable | string | null;
  private _description: string;
  private _descriptionLocalizations: LocalizationMap | null;
  private _dmPermission: boolean;
  private _group?: string;
  private _guilds: IGuild[];
  private _integrationTypes: ApplicationIntegrationType[];
  private _name: string;
  private _nameLocalizations: LocalizationMap | null;
  private _nsfw: boolean;
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

  get defaultMemberPermissions(): PermissionResolvable | string | null {
    return this._defaultMemberPermissions;
  }
  set defaultMemberPermissions(value: PermissionResolvable | string | null) {
    this._defaultMemberPermissions = value;
  }

  get dmPermission(): boolean {
    return this._dmPermission;
  }
  set dmPermission(value: boolean) {
    this._dmPermission = value;
  }

  get contexts(): InteractionContextType[] | null {
    return this._contexts;
  }
  set contexts(value: InteractionContextType[] | null) {
    this._contexts = value;
  }

  get integrationTypes(): ApplicationIntegrationType[] {
    return this._integrationTypes;
  }
  set integrationTypes(value: ApplicationIntegrationType[]) {
    this._integrationTypes = value;
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

  get nsfw(): boolean {
    return this._nsfw;
  }
  set nsfw(value: boolean) {
    this._nsfw = value;
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

  constructor(data: CreateStructure) {
    super();
    this._botIds = data.botIds ?? [];
    this._contexts = data.contexts ?? null;
    this._defaultMemberPermissions = data.defaultMemberPermissions ?? null;
    this._description = data.description;
    this._descriptionLocalizations = data.descriptionLocalizations ?? null;
    this._dmPermission = data.dmPermission ?? true;
    this._guilds = data.guilds ?? [];
    this._integrationTypes = data.integrationTypes ?? [
      ApplicationIntegrationType.GuildInstall,
    ];
    this._name = data.name;
    this._nameLocalizations = data.nameLocalizations ?? null;
    this._nsfw = data.nsfw ?? false;
    this._type = data.type;
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
    guildId: string | null,
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
      descriptionLocalizations: this.descriptionLocalizations,
      name: this.name,
      nameLocalizations: this.nameLocalizations,
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
      contexts: this.contexts,
      defaultMemberPermissions: this.defaultMemberPermissions,
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      dmPermission: this.dmPermission,
      integrationTypes: this.integrationTypes,
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      nsfw: this.nsfw,
      options: options,
      type: this.type,
    };

    return data;
  }

  parseParams(interaction: ChatInputCommandInteraction): Promise<unknown[]> {
    return Promise.all(
      [...this.options].reverse().map((op) => op.parse(interaction)),
    );
  }
}
