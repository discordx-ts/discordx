/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  ClientOptions as DiscordJSClientOptions,
  Message,
} from "discord.js";

import type { ArgSplitter, GuardFunction, IGuild } from "../../index.js";
import type { Awaitable, ILogger, IPrefixResolver } from "../index.js";

export interface SimpleCommandConfig {
  /**
   * Global argument splitter for simple command
   */
  argSplitter?: ArgSplitter;

  /**
   * bot prefix or prefix resolver
   */
  prefix?: IPrefixResolver;

  /**
   * Define global response for certain conditions
   */
  responses?: {
    /**
     * Define response for not found command
     */
    notFound?: string | ((command: Message) => Awaitable<void>);
  };
}

export interface ClientOptions extends DiscordJSClientOptions {
  /**
   * Set the guilds globally for application commands
   */
  botGuilds?: IGuild[];

  /**
   * Specify bot id (added for multiple bot support)
   */
  botId?: string;

  /**
   * The global guards
   */
  guards?: GuardFunction[];

  /**
   * Set custom logger implementation
   */
  logger?: ILogger;

  /**
   * Do not log anything
   */
  silent?: boolean;

  /**
   * simple command related customization
   */
  simpleCommand?: SimpleCommandConfig;
}
