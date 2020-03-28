import { ICommandNotFoundParams } from "./ICommandNotFoundParams";

export interface ICommandParams extends ICommandNotFoundParams {
  commandCaseSensitive?: boolean;
}
