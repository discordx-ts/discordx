/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { DIService } from "@discordx/di";
import type KoaRouter from "@koa/router";
import KoaClient from "koa";

import { MetadataStorage } from "./logic/metadata.js";
import type { KoaClientOptions } from "./types/index.js";

export class Koa extends KoaClient {
  private _api: string;
  private _globalMiddlewares: KoaRouter.Middleware[];

  constructor(options?: KoaClientOptions) {
    super(options);

    this._api = options?.id ?? "api";
    this._globalMiddlewares = options?.globalMiddlewares ?? [];
  }

  // getters

  get api(): string {
    return this._api;
  }
  set api(value: string) {
    this._api = value;
  }

  get globalMiddlewares(): KoaRouter.Middleware[] {
    return this._globalMiddlewares;
  }
  set globalMiddlewares(value: KoaRouter.Middleware[]) {
    this._globalMiddlewares = value;
  }

  get di(): DIService {
    return DIService.engine;
  }

  get instance(): MetadataStorage {
    return MetadataStorage.instance;
  }

  build(): Promise<void> {
    return MetadataStorage.instance.build(this);
  }
}
