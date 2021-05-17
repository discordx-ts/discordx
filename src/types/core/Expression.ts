import { RuleBuilder, CommandMessage, TypeOrPromise, Client } from "../..";

export type ExpressionFunction = (
  command?: CommandMessage,
  client?: Client
) => TypeOrPromise<Expression>;

export type Expression = string | RegExp | RuleBuilder;
