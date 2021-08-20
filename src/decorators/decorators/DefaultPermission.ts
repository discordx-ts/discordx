import {
  ClassMethodDecorator,
  DApplicationCommand,
  DDiscord,
  DSimpleCommand,
  MetadataStorage,
  Modifier,
} from "../..";

/**
 * Define default permission (also refer to everyone permission) for your slash or simple commands
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/defaultpermission)
 */
export function DefaultPermission(): ClassMethodDecorator;

/**
 * Define default permission (also refer to everyone permission) for your slash or simple commands
 * @param permission true | false (default: true)
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/defaultpermission)
 */
export function DefaultPermission(permission?: boolean): ClassMethodDecorator;

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
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
            ].forEach((obj) => {
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
