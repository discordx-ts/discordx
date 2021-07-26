import { MetadataStorage, DSlash, Modifier } from "../..";
import { SubCommand } from "../../types";
import { ClassMethodDecorator } from "../../types/public/decorators";
import { DGroup } from "../classes/DGroup";
import { DOption } from "../classes/DOption";

export function Group(group: string): ClassMethodDecorator;
export function Group(subCommands: SubCommand): ClassMethodDecorator;
export function Group(group: string, description: string): ClassMethodDecorator;
export function Group(
  group: string,
  subCommands: SubCommand
): ClassMethodDecorator;
export function Group(
  group: string,
  description: string,
  subCommands: SubCommand
): ClassMethodDecorator;
export function Group(
  groupOrSubcommands: string | SubCommand,
  subCommandsOrDescription?: SubCommand | string,
  subCommands?: SubCommand
) {
  return function (
    target: Record<string, any>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    // Detect the type of parameters for overloading
    if (typeof groupOrSubcommands === "string") {
      const groupName = groupOrSubcommands.toLocaleLowerCase();
      const groupDescription =
        typeof subCommandsOrDescription === "string"
          ? subCommandsOrDescription
          : undefined;

      // Add the group to groups if @Group decorate a class
      if (!descriptor) {
        const group = DGroup.create<DSlash>(groupName, {
          description: groupDescription,
        }).decorate(target.constructor, target.name);

        MetadataStorage.instance.addGroup(group);
      } else {
        MetadataStorage.instance.addModifier(
          Modifier.create<DSlash>((original) => {
            original.subgroup = groupName;
          }, DSlash).decorate(
            target.constructor,
            key ?? target.constructor.name
          )
        );
      }
    } else {
      // Create a subgroup if @Group decorate a method
      Object.keys(groupOrSubcommands).forEach((key) => {
        const group = DGroup.create<DOption>(key, {
          description: subCommands?.[key],
        }).decorate(target.constructor, target.name);

        MetadataStorage.instance.addSubGroup(group);
      });
    }
  };
}
