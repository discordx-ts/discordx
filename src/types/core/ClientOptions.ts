import { ClientOptions as DiscordJSClientOptions } from "discord.js";
import { LoadClass } from "./LoadClass";

export interface ClientOptions extends DiscordJSClientOptions {
  /**
   * Do not log anything in the console
   */
  silent?: boolean;

  /**
   * The classes to load for your discord bot
   */
  classes: LoadClass[];
}
