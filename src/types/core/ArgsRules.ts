import { Expression } from "./Expression";
import { CommandMessage } from "../public/CommandMessage";
import { TypeOrPromise } from "./TypeOrPromise";

export type SimpleArgsRules<Type extends Expression = Expression> = {
  separator: Expression;
  rules: Type[];
};

export type ArgsRulesFunction<Type extends Expression = Expression>
  = (command?: CommandMessage) => TypeOrPromise<SimpleArgsRules<Type>[]>;

export type FlatArgsRulesFunction<Type extends Expression = Expression>
  = (command?: CommandMessage) => TypeOrPromise<SimpleArgsRules<Type>>;

export type ArgsRules<Type extends Expression = Expression> = ArgsRulesFunction<Type> | FlatArgsRulesFunction<Type>;
