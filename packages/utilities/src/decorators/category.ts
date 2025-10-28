/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  type ClassMethodDecorator,
  DApplicationCommand,
  DDiscord,
  DSimpleCommand,
  MetadataStorage,
  Modifier,
} from "discordx";

export interface ICategory {
  category?: string;
}

export function Category(category: string): ClassMethodDecorator {
  return (target, key, descriptor?: PropertyDescriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (
          original:
            | ((DApplicationCommand | DSimpleCommand) & ICategory)
            | DDiscord,
        ) => {
          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
            ].forEach(
              (ob: (DApplicationCommand | DSimpleCommand) & ICategory) => {
                ob.category = category;
              },
            );
          } else {
            original.category = category;
          }
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord,
      ).attachToTarget(target, key, descriptor),
    );
  };
}
