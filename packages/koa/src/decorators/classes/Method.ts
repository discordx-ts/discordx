import { DRouter } from "../index.js";
import { Decorator } from "@discordx/internal";

export abstract class Method extends Decorator {
  protected _router!: DRouter;

  get router(): DRouter {
    return this._router;
  }
  set router(value: DRouter) {
    this._router = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get handler(): any {
    return this._method?.bind(this._router.instance);
  }
}
