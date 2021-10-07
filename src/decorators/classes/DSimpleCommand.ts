import {
  ApplicationCommandPermissionData,
  Guild,
  GuildChannel,
  GuildMember,
  Role,
  ThreadChannel,
  User,
} from "discord.js";
import {
  ArgSplitter,
  DSimpleCommandOption,
  IGuild,
  IPermissions,
  SimpleCommandMessage,
  SimpleCommandOptionType,
  resolveIPermission,
} from "../..";
import { Method } from "./Method";

/**
 * @category Decorator
 */
export class DSimpleCommand extends Method {
  private _description: string;
  private _name: string;
  private _defaultPermission: boolean;
  private _directMessage: boolean;
  private _argSplitter: ArgSplitter;
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

  get argSplitter(): ArgSplitter {
    return this._argSplitter;
  }
  set argSplitter(value: ArgSplitter) {
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
    description?: string,
    argSplitter?: ArgSplitter,
    directMessage?: boolean,
    defaultPermission?: boolean,
    guilds?: IGuild[],
    botIds?: string[],
    aliases?: string[]
  ) {
    super();
    this._name = name;
    this._description = description ?? this.name;
    this._defaultPermission = defaultPermission ?? true;
    this._directMessage = directMessage ?? true;
    this._argSplitter = argSplitter ?? " ";
    this._options = [];
    this._permissions = [];
    this._guilds = guilds ?? [];
    this._botIds = botIds ?? [];
    this._aliases = aliases ?? [];
  }

  static create(
    name: string,
    description?: string,
    argSplitter?: ArgSplitter,
    directMessage?: boolean,
    defaultPermission?: boolean,
    guilds?: IGuild[],
    botIds?: string[],
    aliases?: string[]
  ): DSimpleCommand {
    return new DSimpleCommand(
      name,
      description,
      argSplitter,
      directMessage,
      defaultPermission,
      guilds,
      botIds,
      aliases
    );
  }

  permissionsPromise(
    guild: Guild | null
  ): Promise<ApplicationCommandPermissionData[]> {
    return resolveIPermission(guild, this.permissions);
  }

  parseParams(command: SimpleCommandMessage): SimpleCommandOptionType[] {
    return command.options;
  }

  parseParamsEx(
    command: SimpleCommandMessage
  ): (
    | string
    | number
    | boolean
    | ThreadChannel
    | GuildChannel
    | User
    | GuildMember
    | Role
    | null
    | undefined
  )[] {
    if (!this.options.length) {
      return [];
    }

    const args =
      typeof this.argSplitter === "function"
        ? this.argSplitter(command)
        : command.argString
            .split(this.argSplitter)
            .filter((op) => op?.length)
            .map((op) => op.trim());

    return this.options
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((op, index) => {
        // only digits
        const id = args[index]?.replace(/\D/g, "");

        // undefined
        if (!args[index]?.length) {
          return undefined;
        }

        // Boolean
        if (op.type === "BOOLEAN") {
          return Boolean(args[index]);
        }

        // Number
        if (op.type === "NUMBER" || op.type === "INTEGER") {
          return Number(args[index]);
        }

        // Channel | undefined
        if (op.type === "CHANNEL") {
          if (!id?.length) {
            return undefined;
          }
          return command.message.guild?.channels.resolve(id);
        }

        // Role | undefined
        if (op.type === "ROLE") {
          if (!id?.length) {
            return undefined;
          }

          return command.message.guild?.roles.resolve(id);
        }

        // GuildMember | User | undefined
        if (op.type === "USER") {
          if (!id?.length) {
            return undefined;
          }

          if (command.message.channel.type === "DM") {
            return command.message.client.user?.id === id
              ? command.message.client.users.resolve(id)
              : command.message.author;
          }

          return command.message.guild?.members.resolve(id);
        }

        // GuildMember | User | Role | undefined
        if (op.type === "MENTIONABLE") {
          if (!id?.length) {
            return undefined;
          }

          if (command.message.channel.type === "DM") {
            return command.message.client.user?.id === id
              ? command.message.client.users.resolve(id)
              : command.message.author;
          }

          return (
            command.message.guild?.members.resolve(id) ??
            command.message.guild?.roles.resolve(id)
          );
        }

        // string
        return args[index];
      });
  }
}
