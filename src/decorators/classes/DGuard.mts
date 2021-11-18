import { Decorator } from "./Decorator.mjs";
import { GuardFunction } from "../../index.mjs";

/**
 * @category Decorator
 */
export class DGuard extends Decorator {
  protected _fn: GuardFunction;

  get fn(): GuardFunction {
    return this._fn;
  }

  protected constructor(fn: GuardFunction) {
    super();
    this._fn = fn;
  }

  static create(fn: GuardFunction): DGuard {
    return new DGuard(fn);
  }
}
