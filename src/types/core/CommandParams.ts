import {
  Expression
} from "../..";

export interface CommandParams {
  prefix?: Expression;
  message?: Expression;
  commandName?: Expression;
  argsRules?: Expression[];
  argsSeparator?: Expression;
  infos?: any;
}
