import {
  ArgsRulesFunction,
  DCommandNotFound,
  InfosType,
  Expression,
  ExpressionFunction,
} from "../..";

export interface DiscordInfos<InfoType = any> {
  rules: ExpressionFunction[];
  commandNotFound?: DCommandNotFound;
  infos: InfosType<InfoType>;
  description: string;
  prefix: ExpressionFunction;
}
