import { DiscordParamsLimited, Expression } from "../..";

export interface DiscordParams extends DiscordParamsLimited {
  prefix?: Expression;
}
