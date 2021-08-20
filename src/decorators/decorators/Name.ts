import {
  DApplicationCommand,
  DDiscord,
  DSimpleCommand,
  MetadataStorage,
  Modifier,
} from "../..";

/**
 * This decorator is a shortcut to set the name property
 * @param name string
 * @deprecated will be removed by end of auguest 2021.
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/name)
 */
export function Name(name: string) {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (original) => {
          original.name = name;
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
