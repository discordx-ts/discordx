/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApplicationCommandPermissionData, Snowflake } from "discord.js";
import { DSimpleCommandOption, SimpleCommandMessage } from "../..";
import { Method } from "./Method";

/**
 * @category Decorator
 */
export class DSimpleCommand extends Method {
  private _description: string;
  private _name: string;
  private _defaultPermission: boolean;
  private _directMessage: boolean;
  private _argSplitter: string | RegExp;
  private _options: DSimpleCommandOption[] = [];
  private _permissions: ApplicationCommandPermissionData[] = [];
  private _guilds: Snowflake[];
  private _botIds: string[];
  private _aliases: string[];

  get aliases() {
    return this._aliases;
  }
  set aliases(value) {
    this._aliases = value;
  }

  get botIds() {
    return this._botIds;
  }
  set botIds(value) {
    this._botIds = value;
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

  get argSplitter() {
    return this._argSplitter;
  }
  set argSplitter(value) {
    this._argSplitter = value;
  }

  get directMessage() {
    return this._directMessage;
  }
  set directMessage(value) {
    this._directMessage = value;
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
  set options(value: DSimpleCommandOption[]) {
    this._options = value;
  }

  protected constructor(
    name: string,
    description?: string,
    argSplitter?: string | RegExp,
    directMessage?: boolean,
    defaultPermission?: boolean,
    guilds?: Snowflake[],
    botIds?: string[],
    aliases?: string[]
  ) {
    super();
    this._name = name.toLowerCase();
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
    argSplitter?: string | RegExp,
    directMessage?: boolean,
    defaultPermission?: boolean,
    guilds?: Snowflake[],
    botIds?: string[],
    aliases?: string[]
  ) {
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

  parseParams(command: SimpleCommandMessage) {
    return command.options;
  }

  parseParamsEx(command: SimpleCommandMessage) {
    if (!this.options.length) {
      return [];
    }

    const args = command.argString
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
