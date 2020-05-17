import {
  InfosType,
  RuleBuilder,
  ArgsRulesFunction,
  Expression,
  ExpressionFunction
} from "../..";

export interface CommandInfos<InfoType = any> {
  prefix: Expression | ExpressionFunction;
  commandName: Expression | ExpressionFunction;
  description: string;
  infos: InfosType<InfoType>;
  argsRules: ArgsRulesFunction<RuleBuilder>[];
}
