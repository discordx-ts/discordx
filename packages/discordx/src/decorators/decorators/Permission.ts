import type { ClassMethodDecorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { IDefaultPermission, IPermissions } from "../../index.js";
import {
  DApplicationCommand,
  DDiscord,
  DefaultPermissionResolver,
  DSimpleCommand,
  MetadataStorage,
} from "../../index.js";

/**
 * Set default permission for your simple command or slash command
 *
 * @param permission Resolver or boolean
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/permission)
 *
 * @category Decorator
 */
export function Permission(
  permission: IDefaultPermission
): ClassMethodDecorator;

/**
 * Set permissions for your simple command or slash command
 *
 * @param permission Resolver or permission object
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/permission)
 *
 * @category Decorator
 */
export function Permission(permission: IPermissions): ClassMethodDecorator;

export function Permission(
  permission: IDefaultPermission | IPermissions
): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    const isDefaultPermission =
      typeof permission === "boolean" ||
      permission instanceof DefaultPermissionResolver;
    const isArray = permission instanceof Array;
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (original) => {
          if (isDefaultPermission) {
            original.defaultPermission = permission;
          } else if (isArray) {
            original.permissions = [...original.permissions, ...permission];
          } else {
            original.permissions = [...original.permissions, permission];
          }

          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
            ].forEach((obj) => {
              if (isDefaultPermission) {
                obj.defaultPermission = permission;
              } else if (isArray) {
                obj.permissions = [...obj.permissions, ...permission];
              } else {
                obj.permissions = [...obj.permissions, permission];
              }
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
