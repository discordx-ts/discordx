import type { ITimedSet } from "../types/index.js";
import { Timer } from "./index.js";

/**
 * This set will evict items from the array after the set timeout.
 * This set can only contain unique items, items are unique when === is true
 */
export class TimedSet<T> implements ITimedSet<T> {
  private _map: Map<T, Timer>;

  /**
   * @param _timeOut - Timeout in milliseconds
   */
  constructor(private _timeOut: number) {
    if (Number.isNaN(_timeOut)) {
      throw new Error("Please supply a number");
    }

    this._map = new Map();
  }

  public get size(): number {
    return this._map.size;
  }

  /**
   * Get the raw underlying set backing this times array.
   * NOTE: this set is Immutable
   */
  public get rawSet(): T[] {
    return [...this._map.keys()];
  }

  public get [Symbol.toStringTag](): string {
    return "Set";
  }

  public isEmpty(): boolean {
    return this._map.size === 0;
  }

  public add(key: T): this {
    const timer = new Timer(() => {
      this._map.delete(key);
    }, this._timeOut);
    this._map.set(key, timer);
    return this;
  }

  public has(value: T): boolean {
    return this._map.has(value);
  }

  public delete(key: T): boolean {
    if (!this._map.has(key)) {
      return false;
    }

    const timeoutFunction = this._map.get(key) as Timer;
    timeoutFunction.clearTimer();
    return this._map.delete(key);
  }

  public refresh(key: T): boolean {
    if (!this._map.has(key)) {
      return false;
    }

    const timeoutFunction = this._map.get(key) as Timer;
    timeoutFunction.clearTimer();
    this.add(key);
    return true;
  }

  public clear(): void {
    for (const [, value] of this._map) {
      value.clearTimer();
    }

    this._map = new Map();
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return new Set(this._map.keys())[Symbol.iterator]();
  }

  public entries(): IterableIterator<[T, T]> {
    return new Set([...this._map.keys()]).entries();
  }

  public forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: unknown
  ): void {
    this._map.forEach((value, key) =>
      callbackfn.call(thisArg ? thisArg : this, key, key, this)
    );
  }

  public keys(): IterableIterator<T> {
    return this._map.keys();
  }

  public values(): IterableIterator<T> {
    return this._map.keys();
  }

  public getTimeRemaining(key: T): number {
    const item = this._map.get(key);
    if (!item) {
      return -1;
    }
    return item.timeLeft;
  }
}
