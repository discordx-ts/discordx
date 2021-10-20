import {
  ArgSplitter,
  GuardFunction,
  IGuild,
  SimpleCommandMessage,
} from "../..";
import { ClientOptions as DiscordJSClientOptions, Message } from "discord.js";

export interface SimpleCommandConfig {
  /**
   * bot prefix or prefix resolver
   */
  prefix?: string | ((message: Message) => Promise<string> | string);

  /**
   * Define global response for cetain conditions
   */
  responses?: {
    /**
     * Define response for unauthorized command
     */
    unauthorised?:
      | string
      | ((command: SimpleCommandMessage) => Promise<void> | void);

    /**
     * Define response for not found command
     */
    notFound?: string | ((command: Message) => Promise<void> | void);
  };

  /**
   * Global argument splitter for simple command
   */
  argSplitter?: ArgSplitter;
}

export interface ClientOptions extends DiscordJSClientOptions {
  /**
   * Specifiy bot id (added for multiple bot support)
   */
  botId?: string;

  /**
   * simple command related customization
   */
  simpleCommand?: SimpleCommandConfig;

  /**
   * Do not log anything in the console
   */
  silent?: boolean;

  /**
   * The classes to load for your discord bot
   */
  classes?: string[];

  /**
   * The global guards
   */
  guards?: GuardFunction[];

  /**
   * Set the guilds globally for application commands
   */
  botGuilds?: IGuild[];
}
