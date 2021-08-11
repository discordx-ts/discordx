import { MetadataStorage, Modifier } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DApplicationCommand } from "../classes/DApplicationCommand";

export function Description(description: string): MethodDecoratorEx;
export function Description(description: string) {
  return function (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand>(
        (original) => {
          original.description = description;
        },
        DApplicationCommand,
        DSimpleCommand
      ).decorate(target.constructor, key, descriptor.value)
    );
  };
}
