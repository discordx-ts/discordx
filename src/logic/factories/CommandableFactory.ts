import {
  Commandable,
  Rule,
  Expression
} from "../..";

export class CommandableFactory {
  static create(
    command: Commandable,
    commandName: Expression,
    prefix?: Expression,
    message?: Expression,
    argsRules: Expression[] = [],
    argsSeparator: Expression = " "
  ) {
    command.commandName = Rule(commandName, true);
    command.message = Rule(message, true);
    command.argsSeparator = Rule(argsSeparator, true);
    command.argsRules = argsRules.map((rule) => Rule(rule, true));
    command.prefix = Rule(prefix, true).if(
      (rb) => rb.source && !rb.source.startsWith("^"),
      (rb) => rb.addBefore("^")
    );

    // Build the default query if no rules are provided
    // Prefix: "!", CommandName: "hello" => ^!hello\s({1,}|$)
    if (
      command.commandName.from === String &&
      command.prefix.from === String
    ) {
      command.prefix.add(command.commandName.source).or(
        (rb) => rb.spaceAfter(),
        (rb) => rb.end()
      );
    }
    if (prefix) {
      command.argsRules[0] = command.prefix;
    }

    return command;
  }
}
