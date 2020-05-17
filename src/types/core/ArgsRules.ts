import { Expression } from "./Expression";
import { CommandMessage } from "../public/CommandMessage";
import { TypeOrPromise } from "./TypeOrPromise";

export type ArgsRules<Type extends Expression = Expression> = Type[];

export type ArgsRulesFunction<Type extends Expression = Expression>
  = (command?: CommandMessage) => TypeOrPromise<Type[]>;
