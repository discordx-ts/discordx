import {
  MetadataStorage,
  GuardFunction,
  DGuard,
  Modifier,
  Method,
} from "../..";
import { DButtonComponent } from "../classes/DButtonComponent";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DOn } from "../classes/DOn";
import { DSelectMenuComponent } from "../classes/DSelectMenuComponent";
import { DApplicationCommand } from "../classes/DApplicationCommand";

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
        DSelectMenuComponent,
        DButtonComponent,
        DApplicationCommand,
        DSimpleCommand,
        DOn,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
