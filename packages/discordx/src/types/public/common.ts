/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ClientEvents, LocalizationMap, RestEvents } from "discord.js";

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
export interface EventOptions {
  botIds?: string[];
  event: keyof ClientEvents;
  priority?: number;
}

/**
 * Rest event options
 */
export interface RestEventOptions {
  botIds?: string[];
  event: keyof RestEvents;
  priority?: number;
}

/**
 * Guard function
 */
export type GuardFunction<Type = any, DataType = any> = (
  params: Type,
  client: Client,
  next: Next,
  data: DataType,
) => any;

/**
 * Custom logger
 */
export interface ILogger {
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  log(...args: unknown[]): void;
  warn(...args: unknown[]): void;
}

/**
 * Reaction options
 */
export interface ReactionOptions<T extends string = string> {
  aliases?: string[];
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  emoji: NotEmpty<T>;
  guilds?: IGuild[];
  partial?: boolean;
  remove?: boolean;
}

/**
 * Slash choice type
 */
export interface SlashChoiceType<
  T extends string = string,
  X = string | number,
> {
  name: NotEmpty<T>;
  nameLocalizations?: LocalizationMap;
  value?: X;
}

/**
 * Component type
 */

export interface ComponentOptions<T extends string = string> {
  botIds?: string[];
  guilds?: IGuild[];
  id?: NotEmpty<T> | RegExp;
}
