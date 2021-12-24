import {
  ArgSplitter,
  GuardFunction,
  IGuild,
  SimpleCommandMessage,
} from "../../index.js";
import { Awaitable, ILogger, IPrefixResolver } from "../index.js";
import { ClientOptions as DiscordJSClientOptions, Message } from "discord.js";

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
  silent?: true;

  /**
   * simple command related customization
   */
  simpleCommand?: SimpleCommandConfig;
}
