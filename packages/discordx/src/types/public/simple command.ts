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

export type SimpleCommandOptions<T extends string = string> = {
  aliases?: string[];
  argSplitter?: ArgSplitter;
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  guilds?: IGuild[];
  name?: NotEmpty<T>;
  prefix?: IPrefix;
};

export type SimpleCommandOptionOptions<T extends string = string> = {
  description?: string;
  name: NotEmpty<T>;
  type?: SimpleCommandOptionType;
};

export type SimpleOptionType =
  | string
  | number
  | boolean
  | ThreadChannel
  | GuildChannel
  | User
  | GuildMember
  | Role
  | undefined;

export enum SimpleCommandOptionType {
  String,
  Number,
  Boolean,
  User,
  Channel,
  Role,
  Mentionable,
}
