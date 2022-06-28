import type { Guild } from "discord.js";
import { ChannelType } from "discord.js";

import type {
  ArgSplitter,
  Client,
  DSimpleCommandOption,
  IGuild,
  IPermissions,
  IPrefix,
  SimpleCommandMessage,
  SimpleCommandPermissionData,
  SimpleOptionType,
} from "../../index.js";
import {
  resolveIGuilds,
  resolveIPermissions,
  SimpleCommandOptionType,
} from "../../index.js";
import { Method } from "./Method.js";

/**
 * @category Decorator
 */
export class DSimpleCommand extends Method {
  private _description: string;
  private _name: string;
  private _prefix: IPrefix | undefined;
  private _defaultPermission: boolean;
  private _directMessage: boolean;
  private _argSplitter?: ArgSplitter;
  private _options: DSimpleCommandOption[] = [];
  private _permissions: IPermissions[] = [];
  private _guilds: IGuild[];
  private _botIds: string[];
  private _aliases: string[];

  get aliases(): string[] {
    return this._aliases;
  }
  set aliases(value: string[]) {
    this._aliases = value;
  }

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get prefix(): IPrefix | undefined {
    return this._prefix;
  }
  set prefix(value: IPrefix | undefined) {
    this._prefix = value;
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

  get argSplitter(): ArgSplitter | undefined {
    return this._argSplitter;
  }
  set argSplitter(value: ArgSplitter | undefined) {
    this._argSplitter = value;
  }

  get directMessage(): boolean {
    return this._directMessage;
  }
  set directMessage(value: boolean) {
    this._directMessage = value;
  }

  get defaultPermission(): boolean {
    return this._defaultPermission;
  }
  set defaultPermission(value: boolean) {
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

  get options(): DSimpleCommandOption[] {
    return this._options;
  }
  set options(value: DSimpleCommandOption[]) {
    this._options = value;
  }

  protected constructor(
    name: string,
    aliases?: string[],
    argSplitter?: ArgSplitter,
    botIds?: string[],
    defaultPermission?: boolean,
    description?: string,
    directMessage?: boolean,
    guilds?: IGuild[],
    prefix?: IPrefix
  ) {
    super();
    this._name = name;
    this._description = description ?? this.name;
    this._defaultPermission = defaultPermission ?? true;
    this._directMessage = directMessage ?? true;
    this._argSplitter = argSplitter;
    this._options = [];
    this._permissions = [];
    this._prefix = prefix;
    this._guilds = guilds ?? [];
    this._botIds = botIds ?? [];
    this._aliases = aliases ?? [];
  }

  static create(
    name: string,
    aliases?: string[],
    argSplitter?: ArgSplitter,
    botIds?: string[],
    defaultPermission?: boolean,
    description?: string,
    directMessage?: boolean,
    guilds?: IGuild[],
    prefix?: IPrefix
  ): DSimpleCommand {
    return new DSimpleCommand(
      name,
      aliases,
      argSplitter,
      botIds,
      defaultPermission,
      description,
      directMessage,
      guilds,
      prefix
    );
  }

  isBotAllowed(botId: string): boolean {
    if (!this.botIds.length) {
      return true;
    }

    return this.botIds.includes(botId);
  }

  async getGuilds(
    client: Client,
    command: SimpleCommandMessage
  ): Promise<string[]> {
    const guilds = await resolveIGuilds(client, command, [
      ...client.botGuilds,
      ...this.guilds,
    ]);

    return guilds;
  }

  async isGuildAllowed(
    client: Client,
    command: SimpleCommandMessage,
    guildId: string | null
  ): Promise<boolean> {
    if (!guildId) {
      return true;
    }

    const guilds = await this.getGuilds(client, command);

    if (!guilds.length) {
      return true;
    }

    return guilds.includes(guildId);
  }

  resolvePermissions(
    guild: Guild,
    command: SimpleCommandMessage
  ): Promise<SimpleCommandPermissionData[]> {
    return resolveIPermissions(guild, command, this.permissions);
  }

  parseParams(command: SimpleCommandMessage): SimpleOptionType[] {
    return command.options;
  }

  parseParamsEx(command: SimpleCommandMessage): Promise<SimpleOptionType[]> {
    if (!this.options.length) {
      return Promise.resolve([]);
    }

    const splitterEx = this.argSplitter ?? command.splitter ?? " ";

    const args =
      typeof splitterEx === "function"
        ? splitterEx(command)
        : command.argString
            .split(splitterEx)
            .filter((op) => op?.length)
            .map((op) => op.trim());

    return Promise.all(
      this.options
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map((op, index) => {
          // only digits
          const id = args[index]?.replace(/\D/g, "");
          const invalidError = Error(`Invalid id given: ${args[index]}`);

          // undefined
          if (!args[index]?.length) {
            return undefined;
          }

          // Boolean
          if (op.type === SimpleCommandOptionType.Boolean) {
            const option = args[index];
            if (option === undefined) {
              return undefined;
            }

            if (
              option.toLocaleLowerCase() === "false" ||
              option.toLocaleLowerCase() === "0"
            ) {
              return false;
            }

            return Boolean(option);
          }

          // Number
          if (op.type === SimpleCommandOptionType.Number) {
            return Number(args[index]);
          }

          // Channel | undefined
          if (op.type === SimpleCommandOptionType.Channel) {
            if (!id?.length || id.length < 16 || id.length > 20) {
              return invalidError;
            }

            return command.message.guild?.channels
              .fetch(id)
              .catch((err) => err);
          }

          // Role | undefined
          if (op.type === SimpleCommandOptionType.Role) {
            if (!id?.length || id.length < 16 || id.length > 20) {
              return invalidError;
            }

            return command.message.guild?.roles.fetch(id).catch((err) => err);
          }

          // GuildMember | User | undefined
          if (op.type === SimpleCommandOptionType.User) {
            if (!id?.length || id.length < 16 || id.length > 20) {
              return invalidError;
            }

            if (command.message.channel.type === ChannelType.DM) {
              return command.message.client.user?.id === id
                ? command.message.client.user
                : command.message.author.id === id
                ? command.message.author
                : invalidError;
            }

            return command.message.guild?.members.fetch(id).catch((err) => err);
          }

          // GuildMember | User | Role | undefined
          if (op.type === SimpleCommandOptionType.Mentionable) {
            if (!id?.length || id.length < 16 || id.length > 20) {
              return invalidError;
            }

            if (command.message.channel.type === ChannelType.DM) {
              return command.message.client.user?.id === id
                ? command.message.client.user
                : command.message.author.id === id
                ? command.message.author
                : invalidError;
            }

            return (
              command.message.guild?.members.fetch(id).catch((err) => err) ??
              command.message.guild?.roles.fetch(id).catch((err) => err)
            );
          }

          // string
          return args[index];
        })
    );
  }
}
