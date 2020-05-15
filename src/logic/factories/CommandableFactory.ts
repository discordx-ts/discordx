import {
  Commandable,
  Rule,
  Expression,
  RuleBuilder
} from "../..";

export class CommandableFactory {
  static create(
    command: Commandable,
    prefix?: Expression,
    message?: Expression,
    argsRules: Expression[] = [],
    argsSeparator: Expression = " "
  ) {
    command.message = Rule(message);
    command.argsSeparator = Rule(argsSeparator);
    command.argsRules = argsRules.map((rule) => Rule(rule, true));
    command.prefix = Rule(prefix, true).if(
      (rb) => rb.source && !rb.source.startsWith("^"),
      (rb) => rb.addBefore("^")
    );

    this.updateArgsRules(command as Commandable<RuleBuilder>);

    return command;
  }

  static updateArgsRules(command: Commandable<RuleBuilder>) {
    if (command.prefix.source) {
      command.argsRules[0] = command.prefix;
    }
  }
}
