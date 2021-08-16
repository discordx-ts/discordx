import { ApplicationCommandPermissionData, Snowflake } from "discord.js";
import { Client } from "../..";
import { SimpleCommandMessage } from "../../classes";
import { DSimpleCommandOption } from "./DSimpleCommandOption";
import { Method } from "./Method";

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
    this._guilds = guilds ?? Client.botGuilds;
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
    if (!this.options.length) return [];
    const args = command.argString.split(this.argSplitter);

    return this.options
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((op, index) =>
        !args?.[index]?.length
          ? undefined
          : op.type === "BOOLEAN"
          ? Boolean(args[index])
          : op.type === "NUMBER"
          ? Number(args[index])
          : op.type === "USER"
          ? command.message.channel.type === "DM"
            ? args[index].replace(/\D/g, "") === command.message.client.user?.id
              ? command.message.client.user
              : command.message.author
            : command.message.guild?.members.resolve(
                args[index].replace(/\D/g, "")
              )
          : op.type === "CHANNEL"
          ? command.message.guild?.channels.resolve(
              args[index].replace(/\D/g, "")
            )
          : op.type === "ROLE"
          ? command.message.guild?.roles.resolve(args[index].replace(/\D/g, ""))
          : args[index]
      );
  }
}
