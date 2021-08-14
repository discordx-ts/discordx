import { ApplicationCommandPermissionData } from "discord.js";
import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DApplicationCommand } from "../classes/DApplicationCommand";

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
