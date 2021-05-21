import { ClientOptions as DiscordJSClientOptions } from "discord.js";
import { GuardFunction } from "../public/GuardFunction";
import { LoadClass } from "./LoadClass";

export interface ClientOptions extends DiscordJSClientOptions {
  /**
   * Do not log anything in the console
   */
  silent?: boolean;

  /**
   * The classes to load for your discord bot
   */
  classes?: LoadClass[];

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
