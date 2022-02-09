/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ClientEvents } from "discord.js";

import type { Client, Next } from "../../index.js";

/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/general/argsof)
 */
export type ArgsOf<K extends keyof ClientEvents> = ClientEvents[K];

export type GuardFunction<Type = any, DatasType = any> = (
  params: Type,
  client: Client,
  next: Next,
  datas: DatasType
) => any;

export type EventParams = {
  botIds?: string[];
};

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

export type InitCommandConfig = {
  disable?: {
    /**
     * Disable the add operation, which registers application commands with Discord
     */
    add?: boolean;

    /**
     * Disable the delete operation, which unregisters application commands with Discord
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

export type ILogger = {
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  log(...args: unknown[]): void;
  warn(...args: unknown[]): void;
};
