import { MetadataStorage, Modifier } from "../..";
import { DCommand } from "../classes/DCommand";
import { DDiscord } from "../classes/DDiscord";
import { DSlash } from "../classes/DSlash";

export function DefaultPermission();
export function DefaultPermission(permission: boolean);
export function DefaultPermission(permission?: boolean) {
  return (target: Object, key: string, descriptor: PropertyDescriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DDiscord>(
        (original) => {
          original.defaultPermission = permission ?? true;

          if (original instanceof DDiscord) {
            original.slashes.forEach((slash) => {
              slash.defaultPermission = permission ?? true;
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
