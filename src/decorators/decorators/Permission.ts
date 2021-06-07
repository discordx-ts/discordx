import { MetadataStorage, Modifier, PermissionType } from "../..";
import { DDiscord } from "../classes/DDiscord";
import { DSlash } from "../classes/DSlash";

export function Permission(id: string, type: PermissionType);
export function Permission(id: string, type: PermissionType) {
  const permission = {
    id,
    type
  };

  return async (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DDiscord>(async (original) => {
        original.defaultPermission = false;
        original.permissions = [...original.permissions, permission];

        if (original instanceof DDiscord) {
          original.slashes.map((slash) => {
            slash.defaultPermission = false;
            slash.permissions = [...slash.permissions, permission];
          });
        }
      }, DSlash, DDiscord).decorateUnknown(target, key, descriptor)
    );
  };
}
