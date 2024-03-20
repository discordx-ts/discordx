/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { constructor } from "tsyringe/dist/typings/types/index.js";
import type { Constructable, Container, Service } from "typedi";
import { Token } from "typedi";

import type { InstanceOf } from "../../index.js";
import { AbstractConfigurableDependencyInjector } from "../AbstractConfigurableDependencyInjector.js";

export class TypeDiDependencyRegistryEngine extends AbstractConfigurableDependencyInjector<
  typeof Container
> {
  public static token = new Token<unknown>("discordx");

  private static _instance: TypeDiDependencyRegistryEngine;

  private service: typeof Service | undefined;

  public static get instance(): TypeDiDependencyRegistryEngine {
    if (!TypeDiDependencyRegistryEngine._instance) {
      TypeDiDependencyRegistryEngine._instance =
        new TypeDiDependencyRegistryEngine();
    }

    return TypeDiDependencyRegistryEngine._instance;
  }

  public addService<T>(classType: T): void {
    const clazz = classType as unknown as new () => InstanceOf<T>;
    if (!this.service) {
      throw new Error("Please set the Service!");
    }

    this._serviceSet.add(classType);
    if (this.useToken) {
      this.service({
        id: TypeDiDependencyRegistryEngine.token,
        multiple: true,
      })(clazz);
    } else {
      this.service()(clazz);
    }
  }

  public clearAllServices(): void {
    if (!this.injector) {
      throw new Error("Please set the Service!");
    }
    this.injector.reset();
  }

  public setService(service: typeof Service): this {
    this.service = service;
    return this;
  }

  public setToken<T>(token: Token<T>): this {
    TypeDiDependencyRegistryEngine.token = token;
    return this;
  }

  public getAllServices(): Set<unknown> {
    if (!this.injector) {
      throw new Error("Please set the Service!");
    }

    if (this.useToken) {
      return new Set(
        this.injector.getMany(TypeDiDependencyRegistryEngine.token),
      );
    }

    const retSet = new Set<unknown>();
    for (const classRef of this._serviceSet) {
      retSet.add(this.injector.get(classRef as constructor<unknown>));
    }

    return retSet;
  }

  public getService<T>(classType: T): InstanceOf<T> | null {
    if (!this.injector) {
      throw new Error("Please set the Service!");
    }

    if (this.useToken) {
      return (
        (this.injector
          .getMany(TypeDiDependencyRegistryEngine.token)
          .find(
            (clazz) =>
              ((clazz as Record<string, unknown>)
                .constructor as unknown as T) === classType,
          ) as InstanceOf<T>) ?? null
      );
    }

    return this.injector.get(classType as Constructable<T>) as InstanceOf<T>;
  }
}
