import {
  MetadataStorage,
  DCommand,
  Modifier,
  DDiscord,
  Expression,
  RuleBuilder,
  ArgsRulesFunction,
  SimpleExpression,
  ArgsRules,
  CommandMessage,
  TypeOrPromise,
  SimpleArgsRules
} from "..";

export type ComputedArgsRule = (command: CommandMessage) => TypeOrPromise<SimpleArgsRules[]>;

export function Rules(rules: Expression[]);
export function Rules(seprator: Expression, rules: Expression[]);
export function Rules(params: SimpleArgsRules[]);
export function Rules(params: ArgsRules);
export function Rules(
  sepratorOrRules: Expression | ComputedArgsRule | Expression[] | ArgsRules | SimpleArgsRules[],
  rules?: Expression[]
) {
  return (target: Function, key?: string, descriptor?: PropertyDescriptor) => {
    const isSeparator = RuleBuilder.isSimpleExpression(sepratorOrRules);
    let finalFuncs: ArgsRules;

    if (typeof sepratorOrRules === "function") {
      // If Rules(params: RulesParamsFunction)
      finalFuncs = sepratorOrRules as ArgsRules;
    } else if (isSeparator) {
      // If Rules(seprator: Expression, rules: Expression[])
      finalFuncs = () => ({
        separator: sepratorOrRules as Expression,
        rules: RuleBuilder.fromArray(rules)
      });
    } else if (Array.isArray(sepratorOrRules)) {
      if (typeof RuleBuilder.isSimpleExpression(sepratorOrRules[0])) {
        finalFuncs = () => ({
          separator: RuleBuilder.atLeastOneSpace,
          rules: sepratorOrRules as Expression[]
        });
      } else {
        // If Rules(rules: Expression[])
        finalFuncs = () => ({
          separator: RuleBuilder.atLeastOneSpace,
          rules: RuleBuilder.fromArray(sepratorOrRules as Expression[])
        });
      }
    }

    MetadataStorage.instance.addModifier(
      Modifier
      .createModifier<DCommand | DDiscord>(
        async (original) => {
          original.argsRules = [
            ...original.argsRules,
            finalFuncs
          ];
        }
      )
      .decorateUnknown(
        target,
        key,
        descriptor
      )
    );
  };
}
