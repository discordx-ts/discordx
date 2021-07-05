import { ClientOptions as DiscordJSClientOptions } from "discord.js";
import { GuardFunction } from "../public/GuardFunction";

export interface ClientOptions extends DiscordJSClientOptions {
  /**
   * Specifiy bot id (added for multiple bot support)
   */
  botId: string;

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
   * Set the default required value for @Option
   */
  requiredByDefault?: boolean;

  /**
   * Set the guilds globaly
   */
  slashGuilds?: string[];
}
