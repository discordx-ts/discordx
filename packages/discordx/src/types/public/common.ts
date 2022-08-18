/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ClientEvents,
  LocalizationMap,
  PermissionResolvable,
  RestEvents,
} from "discord.js";

import type { Client, IGuild, Next, NotEmpty } from "../../index.js";

/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/general/args-of)
 */
export type ArgsOf<K extends keyof ClientEvents> = ClientEvents[K];

/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/general/rest-args-of)
 */
export type RestArgsOf<K extends keyof RestEvents> = RestEvents[K];

/**
 * Event options
 */
export type EventOptions = {
  botIds?: string[];
  event: keyof ClientEvents;
};

/**
 * Rest event options
 */
export type RestEventOptions = {
  botIds?: string[];
  event: keyof RestEvents;
};

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

export type SlashGroupBase = {
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  name: string;
  nameLocalizations?: LocalizationMap;
};

export type SlashGroupRoot = SlashGroupBase & {
  defaultMemberPermissions?: PermissionResolvable;
  dmPermission?: boolean;
  root?: undefined;
};

export type SlashGroupSubRoot = SlashGroupBase & {
  defaultMemberPermissions?: undefined;
  dmPermission?: undefined;
  root?: string;
};

export type SlashGroupOptions = SlashGroupRoot | SlashGroupSubRoot;

/**
 * Reaction options
 */
export type ReactionOptions<T extends string = string> = {
  aliases?: string[];
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  emoji: NotEmpty<T>;
  guilds?: IGuild[];
  partial?: boolean;
  remove?: boolean;
};

/**
 * Slash choice type
 */
export type SlashChoiceType<T extends string = string, X = string | number> = {
  name: NotEmpty<T>;
  value?: X;
};

/**
 * Component type
 */

export type ComponentOptions<T extends string = string> = {
  botIds?: string[];
  guilds?: IGuild[];
  id?: NotEmpty<T> | RegExp;
};
