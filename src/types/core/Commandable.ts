import { Expression, InfosType, ArgsRules } from "../..";

export interface Commandable<Type extends Expression = Expression> {
  argsRules: ArgsRules<Type>[];
  infos: InfosType;
}
