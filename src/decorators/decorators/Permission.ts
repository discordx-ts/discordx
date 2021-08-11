import { ApplicationCommandPermissionData } from "discord.js";
import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DSimpleCommand } from "../classes/DSimpleCommand";
import { DDiscord } from "../classes/DDiscord";
import { DApplicationCommand } from "../classes/DApplicationCommand";

export function Permission(
  permission: ApplicationCommandPermissionData
): ClassMethodDecorator;
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
            [...original.slashes, ...original.commands].forEach((obj) => {
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
