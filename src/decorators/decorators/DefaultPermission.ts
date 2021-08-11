import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DApplicationCommand } from "../classes/DApplicationCommand";

export function DefaultPermission(permission?: boolean): ClassMethodDecorator {
  return function (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (original) => {
          original.defaultPermission = permission ?? true;

          if (original instanceof DDiscord) {
            [...original.slashes, ...original.commands].forEach((obj) => {
              obj.defaultPermission = permission ?? true;
            });
          }
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
