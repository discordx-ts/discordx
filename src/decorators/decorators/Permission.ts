import { MetadataStorage, DChoice, DOption, Modifier } from "../..";
import { DDiscord } from "../classes/DDiscord";
import { DSlash } from "../classes/DSlash";

export function Permission(roleID: string);
export function Permission(...roleID: string[]);
export function Permission(...roleIDs: string[]) {
  return async (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DDiscord>(async (original) => {
        if (original instanceof DDiscord) {
          original.slashes.map((slash) => {
            slash.defaultPermission = false;
            slash.permissions = [...slash.permissions, ...roleIDs];
          });
        } else {
          original.defaultPermission = false;
          original.permissions = [...original.permissions, ...roleIDs];
        }
      }, DSlash, DDiscord).decorateUnknown(target, key, descriptor)
    );
  };
}
