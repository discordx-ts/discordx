import { StringOptionType } from "../..";

export interface SlashOptionParams {
  type?: Exclude<StringOptionType, "SUB_COMMAND" | "SUB_COMMAND_GROUP">;
  description?: string;
  required?: boolean;
}
