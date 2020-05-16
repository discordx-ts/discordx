import {
  RuleBuilder,
  CommandMessage,
  TypeOrPromise
} from "../..";

export type SimpleExpression = string | RegExp | RuleBuilder;
export type Expression = SimpleExpression;
