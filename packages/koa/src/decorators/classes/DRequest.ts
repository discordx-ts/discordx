import type KoaRouter from "@koa/router";

import type { RequestType } from "../../index.js";
import { Method } from "./Method.js";

type Args = {
  description?: string;
  name: string;
  path: string | RegExp;
  type: RequestType;
};

export class DRequest extends Method {
  private _api?: string;
  private _name: string;
  private _description?: string;
  private _type: RequestType;
  private _path: string | RegExp;
  private _middleware: KoaRouter.Middleware[] = [];

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

  get description(): string | undefined {
    return this._description;
  }

  get path(): string | RegExp {
    return this._path;
  }

  get middleware(): KoaRouter.Middleware[] {
    return this._middleware;
  }
  set middleware(value: KoaRouter.Middleware[]) {
    this._middleware = value;
  }

  protected constructor(data: Args) {
    super();
    this._name = data.name;
    this._description = data.description;
    this._type = data.type;
    this._path = data.path;
  }

  setName(value: string): void {
    this._name = value;
  }

  setDescription(value: string): void {
    this._description = value;
  }

  static create(data: Args): DRequest {
    return new DRequest(data);
  }
}
