import KoaRouter from "@koa/router";
import { Method } from "./Method.js";
import { RequestType } from "../../index.js";

type Args = {
  description: string;
  name: string;
  path: string | RegExp;
  type: RequestType;
};

export class DReqeuest extends Method {
  private _api?: string;
  private _name: string;
  private _description: string;
  private _type: RequestType;
  private _path: string | RegExp;
  private _middleWares: KoaRouter.Middleware[] = [];

  get api(): string | undefined {
    return this._api;
  }
  set api(value: string | undefined) {
    this._api = value;
  }

  get type(): RequestType {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get path(): string | RegExp {
    return this._path;
  }

  get middlewares(): KoaRouter.Middleware[] {
    return this._middleWares;
  }
  set middlewares(value: KoaRouter.Middleware[]) {
    this._middleWares = value;
  }

  protected constructor(data: Args) {
    super();
    this._name = data.name;
    this._description = data.description;
    this._type = data.type;
    this._path = data.path;
  }

  static create(data: Args): DReqeuest {
    return new DReqeuest(data);
  }
}
