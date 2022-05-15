/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ClientEvents } from "discord.js";

import type { Client, Next, NotEmpty } from "../../index.js";

/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/general/argsof)
 */
export type ArgsOf<K extends keyof ClientEvents> = ClientEvents[K];

/**
 * Discord events
 */
export type DiscordEvents = keyof ClientEvents;

/**
 * Guard function
 */
export type GuardFunction<Type = any, DataType = any> = (
  params: Type,
  client: Client,
  next: Next,
  data: DataType
) => any;

/**
 * Init command configuration
 */
export type InitCommandOptions = {
  disable?: {
    /**
     * Disable the add operation, which registers application commands with Discord
     */
    add?: boolean;

    /**
     * Disable the delete operation, which unregister application commands with Discord
     */
    delete?: boolean;

    /**
     * Disable the update operation, which update application commands with Discord
     */
    update?: boolean;
  };

  /**
   * Enable logging
   */
  log?: boolean;
  /**
   * Disable specific actions
   */
};

/**
 * Custom logger
 */
export type ILogger = {
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  log(...args: unknown[]): void;
  warn(...args: unknown[]): void;
};

/**
 * Slash group options
 */
export type SlashGroupOptions = {
  description?: string;
  name: string;
  root?: string;
};

/**
 * Event options
 */
export type EventOptions = {
  botIds?: string[];
};

/**
 * Slash choice type
 */
export type SlashChoiceType<T extends string = string, X = string | number> = {
  name: NotEmpty<T>;
  value?: X;
};

/**
 * Channel Types
 *
 * note: type will be removed in djs v14
 */
export type ChannelTypes =
  | "GUILD_TEXT"
  | "DM"
  | "GUILD_VOICE"
  | "GROUP_DM"
  | "GUILD_CATEGORY"
  | "GUILD_NEWS"
  | "GUILD_STORE"
  | "GUILD_NEWS_THREAD"
  | "GUILD_PUBLIC_THREAD"
  | "GUILD_PRIVATE_THREAD"
  | "GUILD_STAGE_VOICE";
