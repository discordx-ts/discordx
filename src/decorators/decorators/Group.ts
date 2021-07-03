import { MetadataStorage, DSlash, Modifier } from "../..";
import { SubCommand } from "../../types";
import { DGroup } from "../classes/DGroup";
import { DOption } from "../classes/DOption";

export function Group(group: string);
export function Group(subCommands: SubCommand);
export function Group(group: string, description: string);
export function Group(group: string, subCommands: SubCommand);
export function Group(
  group: string,
  description: string,
  subCommands: SubCommand
);
export function Group(
  groupOrSubcommands: string | SubCommand,
  subCommandsOrDescription?: SubCommand | string,
  subCommands?: SubCommand
) {
  return (
    target: Function | Object,
    key?: string,
    descriptor?: PropertyDescriptor
  ) => {
    // Detect the type of parameters for overloading
    const isGroup = typeof groupOrSubcommands === "string";
    const group = isGroup
      ? (groupOrSubcommands as string).toLocaleLowerCase()
      : undefined;

    const isDescription = typeof subCommandsOrDescription === "string";
    const description = isDescription
      ? (subCommandsOrDescription as string)
      : undefined;

    if (subCommandsOrDescription !== undefined && !isDescription) {
      subCommands = subCommandsOrDescription as SubCommand;
    }

    subCommands = isGroup ? subCommands : (groupOrSubcommands as SubCommand);

    if (!descriptor) {
      // Add the group to groups if @Group decorate a class
      if (group) {
        const group = DGroup.create<DSlash>(
          (groupOrSubcommands as string) ?? key,
          { description }
        ).decorate(target as Function, (target as Function).name);

        MetadataStorage.instance.addGroup(group);
      }

      // Create a subgroup if @Group decorate a method
      if (subCommands) {
        Object.keys(subCommands).forEach((key) => {
          const group = DGroup.create<DOption>(key, {
            description: subCommands?.[key],
          }).decorate(target as Function, (target as Function).name);

          MetadataStorage.instance.addSubGroup(group);
        });
      }
    } else {
      // If @Group decorate a method edit the method and add it to subgroup
      MetadataStorage.instance.addModifier(
        Modifier.create<DSlash>(async (original) => {
          original.subgroup = group as string;
        }, DSlash).decorate(target.constructor, key as string)
      );
    }
  };
}
