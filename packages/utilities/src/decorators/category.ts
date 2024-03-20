/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ClassMethodDecorator } from "discordx";
import {
  DApplicationCommand,
  DDiscord,
  DSimpleCommand,
  MetadataStorage,
  Modifier,
} from "discordx";

export interface ICategory<T = string> {
  category?: T;
}

export function Category<T = string>(data: T): ClassMethodDecorator {
  return function <D>(
    target: Record<string, D>,
    key?: string,
    descriptor?: PropertyDescriptor,
  ) {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand | DDiscord>(
        (
          original:
            | ((DApplicationCommand | DSimpleCommand) & ICategory<T>)
            | DDiscord,
        ) => {
          if (original instanceof DDiscord) {
            [
              ...original.applicationCommands,
              ...original.simpleCommands,
            ].forEach(
              (ob: (DApplicationCommand | DSimpleCommand) & ICategory<T>) => {
                ob.category = data;
              },
            );
          } else {
            original.category = data;
          }
        },
        DApplicationCommand,
        DSimpleCommand,
        DDiscord,
      ).decorateUnknown(target, key, descriptor),
    );
  };
}
