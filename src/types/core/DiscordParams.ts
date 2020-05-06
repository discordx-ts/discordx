import { PrefixType } from "../..";

export interface DiscordParams {
  prefix?: PrefixType;
  commandCaseSensitive?: boolean;
  importCommands?: (string | Function)[];
}
