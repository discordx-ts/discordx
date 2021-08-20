import {
  ClientOptions as DiscordJSClientOptions,
  Message,
  Snowflake,
} from "discord.js";
import { GuardFunction, SimpleCommandMessage } from "../..";

export interface ClientOptions extends DiscordJSClientOptions {
  /**
   * Specifiy bot id (added for multiple bot support)
   */
  botId?: string;

  /**
   * bot prefix resolver
   */
  prefix?: string | ((message: Message) => Promise<string>);

  /**
   * define bot reply, when command is not auhorized
   */
  commandUnauthorizedHandler?:
    | string
    | ((command: SimpleCommandMessage) => Promise<void>);

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
   * Set the default required value for @SlashOption
   */
  requiredByDefault?: boolean;

  /**
   * Set the guilds globaly for application commands
   */
  botGuilds?: Snowflake[];
}
