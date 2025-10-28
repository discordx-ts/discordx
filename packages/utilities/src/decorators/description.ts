/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import {
  DApplicationCommand,
  DSimpleCommand,
  MetadataStorage,
  type MethodDecoratorEx,
  Modifier,
} from "discordx";

export function Description(description: string): MethodDecoratorEx {
  return (target, key, descriptor?: PropertyDescriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier.create<DApplicationCommand | DSimpleCommand>(
        (original: DApplicationCommand | DSimpleCommand) => {
          original.description = description;
        },
        DApplicationCommand,
        DSimpleCommand,
      ).attachToTarget(target, key, descriptor),
    );
  };
}
