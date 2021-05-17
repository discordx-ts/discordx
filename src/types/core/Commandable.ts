import { Expression, InfosType, ExpressionFunction } from "../..";

export interface Commandable<> {
  rules: (Expression | ExpressionFunction)[];
  normalizedRules: ExpressionFunction[];
  infos: InfosType;
}
