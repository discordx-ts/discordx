import type {
  ClientOptions as DiscordJSClientOptions,
  Message,
} from "discord.js";

import type {
  ArgSplitter,
  GuardFunction,
  IGuild,
  Plugin,
} from "../../index.js";
import type { Awaitable, ILogger, IPrefixResolver } from "../index.js";

export type SimpleCommandConfig = {
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
};

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
   * Set of plugins
   */
  plugins?: Plugin[];

  /**
   * Do not log anything
   */
  silent?: boolean;

  /**
   * simple command related customization
   */
  simpleCommand?: SimpleCommandConfig;
}
