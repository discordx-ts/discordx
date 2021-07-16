import { StringOptionType } from "../..";

export interface OptionParams {
  type?: Exclude<StringOptionType, "SUB_COMMAND" | "SUB_COMMAND_GROUP">;
  description?: string;
  required?: boolean;
}
