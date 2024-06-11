/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { DecoratorUtils } from "../util.js";
import { Decorator } from "./Decorator.js";

export type ModifyFunction<ToModify extends Decorator> = (
  original: ToModify,
) => unknown;

// Base type for constructors of classes extending Decorator.
export type Constructor<T extends Decorator> = new (...args: any[]) => T;

/**
 * Represents a modifier for decorators.
 * @category Internal
 */
export class Modifier<
  ToModify extends Decorator = Decorator,
> extends Decorator {
  private _toModify: ModifyFunction<ToModify>;
  private _modifyTypes: Constructor<ToModify>[];

  /**
   * Constructor to initialize a modifier.
   * @param toModify - The function to modify the decorator.
   * @param modifyTypes - The list of types that can be modified.
   */
  constructor(
    toModify: ModifyFunction<ToModify>,
    modifyTypes: Constructor<ToModify>[],
  ) {
    super();
    this._toModify = toModify;
    this._modifyTypes = modifyTypes;
  }

  /**
   * Creates a new modifier instance.
   * @param toModify - The function to modify the decorator.
   * @param modifyTypes - The list of types that can be modified.
   * @returns A new modifier instance.
   */
  static create<ToModifyEx extends Decorator>(
    toModify: ModifyFunction<ToModifyEx>,
    ...modifyTypes: Constructor<ToModifyEx>[]
  ): Modifier<ToModifyEx> {
    return new Modifier<ToModifyEx>(toModify, modifyTypes);
  }

  /**
   * Applies the modifications from a list of modifiers to a list of decorators.
   * @param modifiers - The list of modifiers.
   * @param originals - The list of decorators to modify.
   * @returns A promise that resolves when all modifications are applied.
   */
  static async applyFromModifierListToList(
    modifiers: Modifier[],
    originals: Decorator[],
  ): Promise<void[]> {
    return Promise.all(
      modifiers.map(async (modifier) => {
        // Get the list of objects that are linked to the specified modifier
        let linked = DecoratorUtils.getLinkedObjects(modifier, originals);

        // Filter the linked objects to match the target types of modification
        linked = linked.filter((linkedOriginal) =>
          modifier._modifyTypes.some((type) => linkedOriginal instanceof type),
        );

        // Apply the modifications
        await Promise.all(
          linked.map((linkedOriginal) =>
            modifier.applyModifications(linkedOriginal),
          ),
        );
      }),
    );
  }

  /**
   * Applies modifications to the specified decorator.
   * @param original - The decorator to modify.
   * @returns The result of the modification function.
   */
  applyModifications(original: ToModify): unknown {
    return this._toModify(original);
  }
}
