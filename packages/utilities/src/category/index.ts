import {
  ClassMethodDecorator,
  DApplicationCommand,
  DDiscord,
  DSimpleCommand,
  MetadataStorage,
  MethodDecoratorEx,
  Modifier,
} from "discordx";

export interface ICategory {
  category?: string;
  categoryNickName?: string;
}

export abstract class CategoryMetaData {
  static get(
    category?: string
  ): readonly ((DApplicationCommand | DSimpleCommand) & ICategory)[] {
    return [
      ...MetadataStorage.instance.applicationCommandSlashes,
      ...MetadataStorage.instance.simpleCommands,
    ].filter(
      (cmd: (DApplicationCommand | DSimpleCommand) & ICategory) =>
        cmd.category === category
    );
  }
}

export function Category(name: string): ClassMethodDecorator {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (
          original:
            | ((DApplicationCommand | DSimpleCommand) & ICategory)
            | DDiscord
        ) => {
          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
            ].forEach(
              (ob: (DApplicationCommand | DSimpleCommand) & ICategory) => {
                ob.category = name;
              }
            );
          } else {
            original.category = name;
          }
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord
      ).decorateUnknown(target, key, descriptor)
    );
  };
}

export function CategoryNickname(nickname: string): MethodDecoratorEx {
  return function <T>(
    target: Record<string, T>,
    key?: string,
    descriptor?: PropertyDescriptor
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand>(
        (original: (DApplicationCommand | DSimpleCommand) & ICategory) => {
          original.categoryNickName = nickname;
        },
        DApplicationCommand,
        DSimpleCommand
      ).decorateUnknown(target, key, descriptor)
    );
  };
}
