import {
  ClientOptions as DiscordJSClientOptions,
  Message,
  Snowflake,
} from "discord.js";
import { DCommand } from "../../decorators/classes/DCommand";
import { GuardFunction } from "../public/GuardFunction";

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
   * define bot reply, when command not found
   */
  commandNotFoundHandler?:
    | string
    | ((
        message: Message,
        command: { name: string; prefix: string }
      ) => Promise<void>);

  /**
   * define bot reply, when command is not auhorized
   */
  commandUnauthorizedHandler?:
    | string
    | ((
        message: Message,
        info: { name: string; prefix: string; command: DCommand }
      ) => Promise<void>);

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
   * Set the guilds globaly
   */
  slashGuilds?: Snowflake[];
}
