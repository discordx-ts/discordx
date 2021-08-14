import {
  MetadataStorage,
  GuardFunction,
  DGuard,
  Modifier,
  Method,
} from "../..";
import { DComponentButton } from "../classes/DComponentButton";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DOn } from "../classes/DOn";
import { DComponentSelectMenu } from "../classes/DComponentSelectMenu";
import { DApplicationCommand } from "../classes/DApplicationCommand";

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
