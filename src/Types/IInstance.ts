import { IDiscordParams, PrefixType } from "..";

export interface IInstance extends IDiscordParams {
  instance?: Function;
  prefix: PrefixType;
}
