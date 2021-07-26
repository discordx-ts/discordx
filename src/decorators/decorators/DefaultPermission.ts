import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DCommand } from "../classes/DCommand";
import { DDiscord } from "../classes/DDiscord";
import { DSlash } from "../classes/DSlash";

export function DefaultPermission(permission?: boolean): ClassMethodDecorator {
  return function (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DCommand | DDiscord>(
        (original) => {
          original.defaultPermission = permission ?? true;

          if (original instanceof DDiscord) {
            [...original.slashes, ...original.commands].forEach((obj) => {
              obj.defaultPermission = permission ?? true;
            });
          }
        },
        DSlash,
        DCommand,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
