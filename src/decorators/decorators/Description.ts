import {
  DApplicationCommand,
  DSimpleCommand,
  MetadataStorage,
  MethodDecoratorEx,
  Modifier,
} from "../..";

/**
 * This decorator is a shortcut to set the description property
 * @param description string
 * @deprecated will be removed by end of auguest 2021.
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/description)
 */
export function Description(description: string): MethodDecoratorEx;

export function Description(description: string): MethodDecoratorEx {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
