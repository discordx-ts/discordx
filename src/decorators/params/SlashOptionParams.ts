import { SlashOptionType } from "../..";

export interface SlashOptionParams {
  type?: Exclude<SlashOptionType, "SUB_COMMAND" | "SUB_COMMAND_GROUP">;
  description?: string;
  required?: boolean;
}
