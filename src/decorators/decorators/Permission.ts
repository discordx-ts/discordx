import {
  ClassMethodDecorator,
  DApplicationCommand,
  DDiscord,
  DSimpleCommand,
  MetadataStorage,
  Modifier,
} from "../..";
import { ApplicationCommandPermissionData } from "discord.js";

/**
 * Define permission for your application command or simple command
 * @param permission https://discord.com/developers/docs/interactions/application-commands#permissions
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/permission)
 */
export function Permission(
  permission: ApplicationCommandPermissionData
): ClassMethodDecorator;

/**
 * Define permission for your application command or simple command
 * @param permission https://discord.com/developers/docs/interactions/application-commands#permissions
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/decorators/general/permission)
 */
export function Permission(
  ...permission: ApplicationCommandPermissionData[]
): ClassMethodDecorator;

export function Permission(
  ...permission: ApplicationCommandPermissionData[]
): ClassMethodDecorator {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (original) => {
          original.permissions = [...original.permissions, ...permission];

          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
            ].forEach((obj) => {
              obj.permissions = [...obj.permissions, ...permission];
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
