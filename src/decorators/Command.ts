import {
  MetadataStorage,
  DCommand,
  Expression,
  RuleBuilder,
  ArgsRules,
  FlatArgsRulesFunction,
  Rule
} from "..";

export function Command();
export function Command(commandName: Expression);
export function Command(commandNameOrFn: FlatArgsRulesFunction);
export function Command(commandNameOrFn?: Expression | FlatArgsRulesFunction) {
  return async (target: Object, key: string, descriptor: PropertyDescriptor) => {
    let argsRule: ArgsRules;
    const method = descriptor.value;
    const isCommandName = RuleBuilder.isSimpleExpression(commandNameOrFn);

    if (isCommandName || !commandNameOrFn) {
      const expr = commandNameOrFn as Expression || key;
      const isRuleBuilder = expr instanceof RuleBuilder;
      argsRule = () => ({
        separator: "",
        rules: [isRuleBuilder ? expr : Rule(expr).end()]
      });
    } else {
      argsRule = commandNameOrFn as FlatArgsRulesFunction;
    }

    const command = (
      DCommand
      .createCommand([argsRule])
      .decorate(
        target.constructor,
        key,
        method
      )
    );

    MetadataStorage.instance.addCommand(command);
  };
}
