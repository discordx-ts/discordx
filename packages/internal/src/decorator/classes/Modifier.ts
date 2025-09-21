/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { getLinkedObjects } from "../util.js";
import { Decorator } from "./Decorator.js";

export type ModificationFunction<TTarget extends Decorator> = (
  targetDecorator: TTarget,
) => void | Promise<void>;

// Constructor type for decorator classes.
export type DecoratorConstructor<T extends Decorator> = new (
  ...args: any[]
) => T;

/**
 * A powerful system for modifying the behavior of existing decorators without altering their implementation.
 *
 * Modifiers allow you to create cross-cutting concerns that can affect multiple decorators
 * based on their type and location. This enables features like development mode overrides,
 * logging, validation, and dynamic behavior changes.
 *
 * @category Internal
 */
export class Modifier<TTarget extends Decorator = Decorator> extends Decorator {
  private _modificationFunction: ModificationFunction<TTarget>;
  private _applicableDecoratorTypes: DecoratorConstructor<TTarget>[];

  /**
   * Creates a new decorator modifier.
   * @param modificationFunction - The function that modifies target decorators.
   * @param applicableDecoratorTypes - The list of decorator types that can be modified.
   */
  constructor(
    modificationFunction: ModificationFunction<TTarget>,
    applicableDecoratorTypes: DecoratorConstructor<TTarget>[],
  ) {
    super();
    this._modificationFunction = modificationFunction;
    this._applicableDecoratorTypes = applicableDecoratorTypes;
  }

  /**
   * Factory method for creating modifier instances with better type inference.
   * @param modificationFunction - The function that performs the modification.
   * @param applicableDecoratorTypes - The decorator types that can be modified.
   * @returns A new modifier instance.
   */
  static create<TModificationTarget extends Decorator>(
    modificationFunction: ModificationFunction<TModificationTarget>,
    ...applicableDecoratorTypes: DecoratorConstructor<TModificationTarget>[]
  ): Modifier<TModificationTarget> {
    return new Modifier<TModificationTarget>(
      modificationFunction,
      applicableDecoratorTypes,
    );
  }

  /**
   * Applies a collection of modifiers to a collection of decorators.
   *
   * This is the main entry point for the modification system. It processes all modifiers
   * and applies them to their applicable decorators in parallel for better performance.
   *
   * @param modifierCollection - The collection of modifiers to apply.
   * @param decoratorCollection - The collection of decorators to potentially modify.
   * @returns A promise that resolves when all modifications are applied.
   */
  static async modify(
    modifierCollection: Modifier[],
    decoratorCollection: Decorator[],
  ): Promise<void> {
    await Promise.all(
      modifierCollection.map(async (modifier) => {
        // Find decorators that are in the same location as this modifier
        let linkedDecorators = getLinkedObjects(modifier, decoratorCollection);

        // Filter to only include decorators that this modifier can affect
        linkedDecorators = linkedDecorators.filter((linkedDecorator) =>
          modifier._applicableDecoratorTypes.some(
            (decoratorType) => linkedDecorator instanceof decoratorType,
          ),
        );

        // Apply modifications to all applicable decorators
        await Promise.all(
          linkedDecorators.map((linkedDecorator) =>
            modifier.apply(linkedDecorator),
          ),
        );
      }),
    );
  }

  /**
   * Applies this modifier's function to a specific decorator.
   * @param targetDecorator - The decorator to modify.
   * @returns The result of the modification function.
   */
  async apply(targetDecorator: TTarget): Promise<void> {
    await this._modificationFunction(targetDecorator);
  }
}
