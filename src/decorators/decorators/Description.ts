import { MetadataStorage, Modifier } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";
import { DCommand } from "../classes/DCommand";
import { DSlash } from "../classes/DSlash";

export function Description(description: string): MethodDecoratorEx;
export function Description(description: string) {
  return function (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DCommand>(
        (original) => {
          original.description = description;
        },
        DSlash,
        DCommand
      ).decorate(target.constructor, key, descriptor.value)
    );
  };
}
