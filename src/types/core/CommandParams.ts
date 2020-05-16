import {
  Expression,
  CommandParamsLimited
} from "../..";

export interface CommandParams extends CommandParamsLimited {
  commandName?: Expression;
}
