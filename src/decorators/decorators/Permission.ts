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
      Modifier.createModifier<DSlash>(async (original) => {
        original.defaultPermission = false;
        original.permissions = [
          ...original.permissions,
          ...roleIDs
        ];
      }).decorateUnknown(target, key, descriptor)
    );
  };
}
