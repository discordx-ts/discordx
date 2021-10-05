import {
  ClassMethodDecorator,
  DApplicationCommand,
  DDiscord,
  DSimpleCommand,
  IPermissions,
  MetadataStorage,
  Modifier,
} from "../..";

/**
 * Define everyone permission for your application command or simple command.
 * @param permission https://discord.com/developers/docs/interactions/application-commands#permissions
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/permission)
 * @category Decorator
 */
export function Permission(permission: boolean): ClassMethodDecorator;

/**
 * Define permission for your application command or simple command
 * @param permission https://discord.com/developers/docs/interactions/application-commands#permissions
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/permission)
 * @category Decorator
 */
export function Permission(permission: IPermissions): ClassMethodDecorator;

/**
 * Define permission for your application command or simple command
 * @param permission https://discord.com/developers/docs/interactions/application-commands#permissions
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/permission)
 * @category Decorator
 */
export function Permission(...permission: IPermissions[]): ClassMethodDecorator;

export function Permission(
  permission: boolean | IPermissions
): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    const isBoolean = typeof permission === "boolean";
    const isArray = permission instanceof Array;
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (original) => {
          if (isBoolean) {
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
              if (isBoolean) {
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
