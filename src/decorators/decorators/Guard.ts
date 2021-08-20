import {
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DDiscord,
  DGuard,
  DOn,
  DSimpleCommand,
  GuardFunction,
  MetadataStorage,
  Method,
  Modifier,
} from "../..";

/**
 * Define guard aka middleware for your application command, simple command, events, select menu, button
 * @param fns array of guards
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/guard)
 */
export function Guard<Type = any, DatasType = any>(
  ...fns: GuardFunction<Type, DatasType>[]
) {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    const guards = fns.map((fn) => {
      return DGuard.create(fn).decorateUnknown(target, key, descriptor);
    });

    MetadataStorage.instance.addModifier(
      Modifier.create<Method>(
        (original) => {
          original.guards = guards;
        },
        DComponentSelectMenu,
        DComponentButton,
        DApplicationCommand,
        DSimpleCommand,
        DOn,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
