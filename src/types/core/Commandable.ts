import { Expression, InfosType, ArgsRulesFunction } from "../..";

export interface Commandable<Type extends Expression = Expression> {
  argsRules: ArgsRulesFunction<Type>[];
  infos: InfosType;
}
