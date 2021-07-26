import { ApplicationCommandPermissionData } from "discord.js";
import { MetadataStorage, Modifier } from "../..";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DCommand } from "../classes/DCommand";
import { DDiscord } from "../classes/DDiscord";
import { DSlash } from "../classes/DSlash";

export function Permission(
  permission: ApplicationCommandPermissionData
): ClassMethodDecorator;
export function Permission(
  ...permission: ApplicationCommandPermissionData[]
): ClassMethodDecorator;
export function Permission(...permission: ApplicationCommandPermissionData[]) {
  return function (
    target: Record<string, any>,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DCommand | DDiscord>(
        (original) => {
          original.permissions = [...original.permissions, ...permission];

          if (original instanceof DDiscord) {
            [...original.slashes, ...original.commands].forEach((obj) => {
              obj.permissions = [...obj.permissions, ...permission];
            });
          }
        },
        DSlash,
        DCommand,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
