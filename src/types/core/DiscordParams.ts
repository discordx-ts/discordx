import { CommandParams } from "../..";

export interface DiscordParams extends CommandParams {
  importCommands?: (string | Function)[];
}
