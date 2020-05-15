import { Expression } from "../..";

export interface Commandable<Type = Expression> {
  message: Type;
  prefix: Type;
  argsRules: Type[];
  argsSeparator: Type;
  commandName?: Type;
  originalRules: Partial<Commandable>;
}
