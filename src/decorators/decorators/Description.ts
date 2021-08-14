import { MetadataStorage, Modifier } from "../..";
import { MethodDecoratorEx } from "../../types/public/decorators";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DApplicationCommand } from "../classes/DApplicationCommand";

/**
 * This decorator is a shortcut to set the description property
 * @param description string
 * @deprecated will be removed by end of auguest 2021.
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/description)
 */
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
