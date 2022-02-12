import type {
  ClientOptions as DiscordJSClientOptions,
  Message,
} from "discord.js";

import type {
  ArgSplitter,
  GuardFunction,
  IGuild,
  SimpleCommandMessage,
} from "../../index.js";
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
   * Define global response for cetain conditions
   */
  responses?: {
    /**
     * Define response for not found command
     */
    notFound?: string | ((command: Message) => Awaitable<void>);

    /**
     * Define response for unauthorized command
     */
    unauthorized?:
      | string
      | ((command: SimpleCommandMessage) => Awaitable<void>);
  };
}

export interface ClientOptions extends DiscordJSClientOptions {
  /**
   * Set the guilds globally for application commands
   */
  botGuilds?: IGuild[];

  /**
   * Specifiy bot id (added for multiple bot support)
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
