import { CommandNotFoundParams } from "./CommandNotFoundParams";

export interface CommandParams extends CommandNotFoundParams {
  commandCaseSensitive?: boolean;
  description?: string;
  infos?: any;
}
