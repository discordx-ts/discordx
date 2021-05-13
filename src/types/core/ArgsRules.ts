import { Expression, CommandMessage, Client, TypeOrPromise } from "../..";

export type ArgsRules<Type extends Expression = Expression> = Type[];

export type ArgsRulesFunction<Type extends Expression = Expression> = (
  command?: CommandMessage,
  client?: Client
) => TypeOrPromise<Type[]>;
