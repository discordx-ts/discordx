import { MetadataStorage, DChoice, DOption, Modifier } from "../..";
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
      Modifier.create<DSlash>(async (original) => {
        original.defaultPermission = false;
        original.permissions = [...original.permissions, ...roleIDs];
      }, DSlash).decorateUnknown(target, key, descriptor)
    );
  };
}
