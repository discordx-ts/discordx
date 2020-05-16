import {
  ArgsRules,
  DCommandNotFound,
  InfosType,
  Expression,
  FlatArgsRulesFunction
} from "../..";

export interface DiscordInfos<InfoType = any> {
  argsRules: ArgsRules[];
  commandNotFound?: DCommandNotFound;
  infos: InfosType<InfoType>;
  description: string;
  prefix: Expression | FlatArgsRulesFunction;
}
