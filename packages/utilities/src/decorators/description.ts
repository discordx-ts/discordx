import type { MethodDecoratorEx } from "discordx";
import {
  DApplicationCommand,
  DSimpleCommand,
  MetadataStorage,
  Modifier,
} from "discordx";

export function Description(description: string): MethodDecoratorEx {
  return function <D>(
    target: Record<string, D>,
    key?: string,
    descriptor?: PropertyDescriptor,
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand>(
        (original: DApplicationCommand | DSimpleCommand) => {
          original.description = description;
        },
        DApplicationCommand,
        DSimpleCommand,
      ).decorateUnknown(target, key, descriptor),
    );
  };
}
