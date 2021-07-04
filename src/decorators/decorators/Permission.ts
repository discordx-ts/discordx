import { ApplicationCommandPermissionData } from "discord.js";
import { MetadataStorage, Modifier } from "../..";
import { DDiscord } from "../classes/DDiscord";
import { DSlash } from "../classes/DSlash";

export function Permission(permission: ApplicationCommandPermissionData);
export function Permission(...permission: ApplicationCommandPermissionData[]);
export function Permission(...permission: ApplicationCommandPermissionData[]) {
  return (target: Object, key: string, descriptor: PropertyDescriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DSlash | DDiscord>(
        (original) => {
          original.permissions = [...original.permissions, ...permission];

          if (original instanceof DDiscord) {
            original.slashes.forEach((slash) => {
              slash.permissions = [...slash.permissions, ...permission];
            });
          }
        },
        DSlash,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
