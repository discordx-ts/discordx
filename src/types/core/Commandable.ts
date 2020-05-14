import { RuleBuilder } from "../..";

export interface Commandable {
  message: RuleBuilder;
  commandName: RuleBuilder;
  prefix: RuleBuilder;
  argsRules: RuleBuilder[];
  argsSeparator: RuleBuilder;
}
