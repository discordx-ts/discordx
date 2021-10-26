import {
  ArgSplitter,
  GuardFunction,
  IGuild,
  SimpleCommandMessage,
} from "../..";
import { ClientOptions as DiscordJSClientOptions, Message } from "discord.js";
import { ILogger } from "..";

export interface SimpleCommandConfig {
  /**
   * Global argument splitter for simple command
   */
  argSplitter?: ArgSplitter;

  /**
   * bot prefix or prefix resolver
   */
  prefix?: string | ((message: Message) => Promise<string> | string);

  /**
   * Define global response for cetain conditions
   */
  responses?: {
    /**
     * Define response for not found command
     */
    notFound?: string | ((command: Message) => Promise<void> | void);

    /**
     * Define response for unauthorized command
     */
    unauthorised?:
      | string
      | ((command: SimpleCommandMessage) => Promise<void> | void);
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
   * The classes to load for your discord bot
   */
  classes?: string[];

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
