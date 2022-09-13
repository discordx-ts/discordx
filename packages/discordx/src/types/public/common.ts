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
 * [View Documentation](https://discordx.js.org/docs/discordx/basics/args-of)
 */
export type ArgsOf<K extends keyof ClientEvents> = ClientEvents[K];

/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://discordx.js.org/docs/discordx/basics/rest-args-of)
 */
export type RestArgsOf<K extends keyof RestEvents> = RestEvents[K];

/**
 * Event options
 */
export type EventOptions = {
  botIds?: string[];
  event: keyof ClientEvents;
  priority?: number;
};

/**
 * Rest event options
 */
export type RestEventOptions = {
  botIds?: string[];
  event: keyof RestEvents;
  priority?: number;
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

export type SlashGroupBase<TName extends string = string> = {
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  name: TName;
  nameLocalizations?: LocalizationMap;
};

export type SlashGroupRoot<TName extends string = string> =
  SlashGroupBase<TName> & {
    defaultMemberPermissions?: PermissionResolvable;
    dmPermission?: boolean;
    root?: undefined;
  };

export type SlashGroupSubRoot<TName extends string = string> =
  SlashGroupBase<TName> & {
    defaultMemberPermissions?: undefined;
    dmPermission?: undefined;
    root?: string;
  };

export type SlashGroupOptions<TName extends string = string> =
  | SlashGroupRoot<TName>
  | SlashGroupSubRoot<TName>;

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
  nameLocalizations?: LocalizationMap;
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
