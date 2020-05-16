import {
  InfosType,
  RuleBuilder,
  ArgsRules,
  Expression,
  FlatArgsRulesFunction
} from "../..";

export interface CommandInfos<InfoType = any> {
  prefix: Expression | FlatArgsRulesFunction;
  commandName: Expression | FlatArgsRulesFunction;
  description: string;
  infos: InfosType<InfoType>;
  argsRules: ArgsRules<RuleBuilder>[];
}
