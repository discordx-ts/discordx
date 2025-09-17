/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Decorator } from "./classes/Decorator.js";

/**
 * Finds all decorators that are applied to the same location as a reference decorator.
 *
 * Decorators are considered "linked" when they are applied to the same class member:
 * - Same class and same method/property for method/property decorators
 * - Same class, same method, and same parameter position for parameter decorators
 *
 * @example
 * ```typescript
 * // Method decorators - all linked together
 * @Slash()
 * @Permission()
 * method() {}
 * ```
 * @example
 * ```typescript
 * // Parameter decorators - each parameter position creates separate links
 * method(
 *    @Option()
 *    @Required()
 *    param: string
 * ) {}
 * ```
 * @example
 * ```typescript
 * // Class decorators - linked to the class itself
 * @Discord()
 * @Injectable()
 * class MyBot {}
 * ```
 * @param referenceDecorator - The decorator to find linked decorators for.
 * @param decoratorCollection - The collection of decorators to search through.
 * @returns Array of decorators that are applied to the same location.
 */
export function getLinkedObjects<TDecorator extends Decorator>(
  referenceDecorator: Decorator,
  decoratorCollection: TDecorator[],
): TDecorator[] {
  return decoratorCollection.filter((candidateDecorator) => {
    let isSameLocation =
      referenceDecorator.from === candidateDecorator.from &&
      referenceDecorator.key === candidateDecorator.key;

    // Ensure parameter decorators only link to decorators on the same parameter position
    // This prevents parameter decorators from affecting all parameters in a method
    if (
      referenceDecorator.index !== undefined &&
      candidateDecorator.index !== undefined
    ) {
      isSameLocation &&= referenceDecorator.index === candidateDecorator.index;
    }

    return isSameLocation;
  });
}
