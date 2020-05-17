import {
  RuleBuilder,
  CommandMessage,
  TypeOrPromise
} from "../..";

export type Expression = string | RegExp | RuleBuilder;

export type ExpressionFunction = (command?: CommandMessage) => TypeOrPromise<Expression>;
