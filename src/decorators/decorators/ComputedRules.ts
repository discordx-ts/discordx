import {
  MetadataStorage,
  DCommand,
  Modifier,
  DDiscord,
  ArgsRulesFunction,
} from "../..";

export function ComputedRules(rules: ArgsRulesFunction);
export function ComputedRules(rules: ArgsRulesFunction) {
  return (target: Function, key?: string, descriptor?: PropertyDescriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier.createModifier<DCommand | DDiscord>(async (original) => {
        original.argsRules = [...original.argsRules, rules];
      }).decorateUnknown(target, key, descriptor)
    );
  };
}
