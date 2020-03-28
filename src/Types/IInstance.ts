import { IDiscordParams } from "..";

export interface IInstance extends IDiscordParams {
  instance?: Function;
  prefix: string;
}
