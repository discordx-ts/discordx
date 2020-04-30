import { PrefixType } from "..";

export interface IDiscordParams {
  prefix?: PrefixType;
  commandCaseSensitive?: boolean;
  importCommands?: (string | Function)[];
}
