/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
/**
 * A set like object that evicts entries from the set after they have been in there for the set time
 */
export interface ITimedSet<T> extends Set<T> {
  /**
   * Get the time left until this item is removed from the set
   */
  getTimeRemaining(key: T): number;

  /**
   * checks if this set is empty
   */
  isEmpty(): boolean;

  /**
   * Refresh the timeout for this element (resets the timer for the items eviction)
   *
   * @param key - Key
   */
  refresh(key: T): boolean;
}
