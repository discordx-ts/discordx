/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { ChannelType } from "discord.js";

import type {
  ArgSplitter,
  Client,
  DSimpleCommandOption,
  IGuild,
  IPrefix,
  SimpleCommandMessage,
  SimpleOptionType,
} from "../../index.js";
import { resolveIGuilds, SimpleCommandOptionType } from "../../index.js";
import { Method } from "./Method.js";

interface CreateStructure {
  aliases?: string[];
  argSplitter?: ArgSplitter;
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  guilds?: IGuild[];
  name: string;
  prefix?: IPrefix;
}

/**
 * @category Decorator
 */
export class DSimpleCommand extends Method {
  private _description: string;
  private _name: string;
  private _prefix: IPrefix | undefined;
  private _directMessage: boolean;
  private _argSplitter?: ArgSplitter;
  private _options: DSimpleCommandOption[] = [];
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

  constructor(data: CreateStructure) {
    super();
    this._name = data.name;
    this._description = data.description ?? this.name;
    this._directMessage = data.directMessage ?? true;
    this._argSplitter = data.argSplitter;
    this._options = [];
    this._prefix = data.prefix;
    this._guilds = data.guilds ?? [];
    this._botIds = data.botIds ?? [];
    this._aliases = data.aliases ?? [];
  }

  static create(data: CreateStructure): DSimpleCommand {
    return new DSimpleCommand(data);
  }

  isBotAllowed(botId: string): boolean {
    if (!this.botIds.length) {
      return true;
    }

    return this.botIds.includes(botId);
  }

  async getGuilds(
    client: Client,
    command: SimpleCommandMessage,
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
    guildId: string | null,
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
            .filter((op) => op.length)
            .map((op) => op.trim());

    return Promise.all(
      this.options
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map(async (op, index) => {
          const option = args[index];

          // only digits
          const id = option?.replace(/\D/g, "");
          const validId =
            id !== undefined && id.length >= 16 && id.length <= 20;

          // undefined
          if (!option?.length) {
            return null;
          }

          // Boolean
          if (op.type === SimpleCommandOptionType.Boolean) {
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
            return Number(option);
          }

          // Channel | null
          if (op.type === SimpleCommandOptionType.Channel) {
            if (!validId || !command.message.guild) {
              return null;
            }

            return command.message.guild.channels.fetch(id).catch(() => null);
          }

          // Role | null
          if (op.type === SimpleCommandOptionType.Role) {
            if (!validId || !command.message.guild) {
              return null;
            }

            return command.message.guild.roles.fetch(id).catch(() => null);
          }

          // GuildMember | User | null
          if (op.type === SimpleCommandOptionType.User) {
            if (!validId) {
              return null;
            }

            if (command.message.channel.type === ChannelType.DM) {
              if (command.message.client.user.id === id) {
                return command.message.client.user;
              }

              if (command.message.author.id === id) {
                return command.message.author;
              }

              return null;
            }

            if (!command.message.guild) {
              return null;
            }

            return command.message.guild.members.fetch(id).catch(() => null);
          }

          // GuildMember | User | Role | null
          if (op.type === SimpleCommandOptionType.Mentionable) {
            if (!validId) {
              return null;
            }

            if (command.message.channel.type === ChannelType.DM) {
              if (command.message.client.user.id === id) {
                return command.message.client.user;
              }

              if (command.message.author.id === id) {
                return command.message.author;
              }

              return null;
            }

            if (!command.message.guild) {
              return null;
            }

            const member = await command.message.guild.members
              .fetch(id)
              .catch(() => null);

            if (member) {
              return member;
            }

            const role = await command.message.guild.roles
              .fetch(id)
              .catch(() => null);

            return role;
          }

          // string
          return option;
        }),
    );
  }
}
