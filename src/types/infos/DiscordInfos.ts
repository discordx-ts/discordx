import {
  ArgsRulesFunction,
  DCommandNotFound,
  InfosType,
  Expression,
  ExpressionFunction
} from "../..";

export interface DiscordInfos<InfoType = any> {
  argsRules: ArgsRulesFunction[];
  commandNotFound?: DCommandNotFound;
  infos: InfosType<InfoType>;
  description: string;
  prefix: Expression | ExpressionFunction;
}
