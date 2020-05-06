import { DiscordParams, PrefixType } from "../..";

export interface DInstance extends DiscordParams {
  instance?: Function;
  prefix: PrefixType;
}
