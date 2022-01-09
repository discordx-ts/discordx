import { DIService } from "@discordx/di";
import { Decorator } from "@discordx/internal";
import KoaRouter from "@koa/router";

type Args = {
  description: string;
  name: string;
  opts?: KoaRouter.RouterOptions;
};

export class DRouter extends Decorator {
  private _api?: string;
  private _name: string;
  private _description: string;
  private _router: KoaRouter;

  get api(): string | undefined {
    return this._api;
  }
  set api(value: string | undefined) {
    this._api = value;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get instance(): unknown {
    return DIService.instance.getService(this.from);
  }

  get router(): KoaRouter {
    return this._router;
  }

  protected constructor(data: Args) {
    super();
    this._name = data.name;
    this._description = data.description;
    this._router = new KoaRouter(data.opts);
  }

  static create(data: Args): DRouter {
    return new DRouter(data);
  }
}
