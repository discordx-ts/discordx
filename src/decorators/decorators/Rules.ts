import {
  MetadataStorage,
  DCommand,
  Modifier,
  DDiscord,
  Expression,
  RuleBuilder,
  ArgsRulesFunction,
} from "../..";

export function Rules(...rules: Expression[]);
export function Rules(...rules: Expression[]) {
  return (target: Function, key?: string, descriptor?: PropertyDescriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier.createModifier<DCommand | DDiscord>(async (original) => {
        original.argsRules = [...original.argsRules, () => rules];
      }).decorateUnknown(target, key, descriptor)
    );
  };
}
