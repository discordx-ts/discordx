/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  GuildChannel,
  GuildMember,
  Role,
  ThreadChannel,
  User,
} from "discord.js";

import type { SimpleCommandMessage } from "../../index.js";
import type { IGuild, IPrefix, NotEmpty } from "../index.js";

export type ArgSplitter =
  | string
  | RegExp
  | ((command: SimpleCommandMessage) => string[]);

export interface SimpleCommandOptions<T extends string = string> {
  aliases?: string[];
  argSplitter?: ArgSplitter;
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  guilds?: IGuild[];
  name?: NotEmpty<T>;
  prefix?: IPrefix;
}

export interface SimpleCommandOptionOptions<T extends string = string> {
  description?: string;
  name: NotEmpty<T>;
  type: SimpleCommandOptionType;
}

export type SimpleOptionType =
  | string
  | number
  | boolean
  | ThreadChannel
  | GuildChannel
  | User
  | GuildMember
  | Role
  | null;

export enum SimpleCommandOptionType {
  String,
  Number,
  Boolean,
  User,
  Channel,
  Role,
  Mentionable,
}
