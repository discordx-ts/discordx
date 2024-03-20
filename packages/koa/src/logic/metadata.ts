/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { DIService } from "@discordx/di";
import type { Decorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { DRequest } from "../decorators/classes/DRequest.js";
import type { DRouter } from "../decorators/classes/DRouter.js";
import { RequestType } from "../index.js";
import type { Koa } from "../Koa.js";

export class MetadataStorage {
  // internal

  private static _isBuilt = false;
  private static _instance: MetadataStorage;
  private _modifiers: Array<Modifier<Decorator>> = [];

  // storage

  private _routers: DRouter[] = [];
  private _routes: DRequest[] = [];

  // internal getters

  static get instance(): MetadataStorage {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }
  static set instance(value: MetadataStorage) {
    this._instance = value;
  }

  static get isBuilt(): boolean {
    return this._isBuilt;
  }

  // storage getter

  get routers(): readonly DRouter[] {
    return this._routers;
  }

  get routes(): readonly DRequest[] {
    return this._routes;
  }

  // methods

  addRouter(router: DRouter): void {
    this._routers.push(router);
    DIService.engine.addService(router.classRef);
  }

  addRequest(route: DRequest): void {
    this._routes.push(route);
  }

  addModifier<T extends Decorator = Decorator>(modifier: Modifier<T>): void {
    this._modifiers.push(modifier as Modifier<Decorator>);
  }

  async build(koa: Koa): Promise<void> {
    // build the instance if not already built
    if (MetadataStorage.isBuilt) {
      return;
    }
    MetadataStorage._isBuilt = true;

    await Modifier.applyFromModifierListToList(this._modifiers, this._routers);
    await Modifier.applyFromModifierListToList(this._modifiers, this._routes);

    this.routers.forEach((r) => {
      this.routes.forEach((route) => {
        if (route.from === r.from) {
          route.router = r;

          // register if filter is valid
          const api = route.api ?? r.api;
          if (!api || koa.api === api) {
            this.registerRoute(koa, r, route);
          }
        }
      });

      koa.use(r.router.routes());
    });
  }

  private registerRoute(koa: Koa, router: DRouter, route: DRequest) {
    switch (route.type) {
      case RequestType.All:
        router.router.all(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Delete:
        router.router.delete(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Get:
        router.router.get(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Head:
        router.router.head(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Link:
        router.router.link(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Options:
        router.router.options(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Patch:
        router.router.patch(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Post:
        router.router.post(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Put:
        router.router.put(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      case RequestType.Unlink:
        router.router.unlink(
          route.path,
          ...koa.globalMiddlewares,
          ...route.middleware,
          route.handler(koa),
        );
        break;

      default: {
        throw Error("Attempted to register an invalid method");
      }
    }
  }
}
