import { Decorator } from "./Decorator";
import { GuardFunction } from "../..";

export class DGuard extends Decorator {
  protected _fn: GuardFunction;

  get fn() {
    return this._fn;
  }

  static createGuard(fn: GuardFunction) {
    const guard = new DGuard();

    guard._fn = fn;

    return guard;
  }
}
