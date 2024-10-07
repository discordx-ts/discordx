/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Decorator } from "./classes/Decorator.js";

/**
 * Gets the list of decorators linked to a specified decorator.
 * @example
 * ```typescript
 * @A()
 * @B()
 * method() {}
 * ```
 * @example
 * ```typescript
 * method(
 *    @A()
 *    @B()
 *    param: string
 * ) {}
 * ```
 * @example
 * ```typescript
 * @A()
 * @B()
 * class X {}
 * ```
 * @param a - The reference decorator.
 * @param list - The list of decorators to filter.
 * @returns The list of linked decorators.
 */
export function getLinkedObjects<Type extends Decorator>(
  a: Decorator,
  list: Type[],
): Type[] {
  return list.filter((b) => {
    let cond = a.from === b.from && a.key === b.key;

    // do not remove this undefined check, cause unexpected error
    // such as choices apply on all options
    if (a.index !== undefined && b.index !== undefined) {
      cond &&= a.index === b.index;
    }

    return cond;
  });
}

/**
 * Determines if the target is a class based on the method descriptor.
 * @param method - The method descriptor.
 * @returns True if the target is a class, false otherwise.
 */
export function decorateAClass(method?: PropertyDescriptor): boolean {
  return !method?.value;
}
