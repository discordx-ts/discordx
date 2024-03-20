/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  DependencyContainer,
  FactoryFunction,
  InjectionToken,
} from "tsyringe";
import type { constructor } from "tsyringe/dist/typings/types/index.js";

import type { InstanceOf } from "../../index.js";
import { AbstractConfigurableDependencyInjector } from "../AbstractConfigurableDependencyInjector.js";

type Factory = <T>(factoryFunc: FactoryFunction<T>) => FactoryFunction<T>;

export class TsyringeDependencyRegistryEngine extends AbstractConfigurableDependencyInjector<DependencyContainer> {
  public static token = Symbol("discordx");

  private static _instance: TsyringeDependencyRegistryEngine;

  private factory: Factory | null = null;

  public static get instance(): TsyringeDependencyRegistryEngine {
    if (!TsyringeDependencyRegistryEngine._instance) {
      TsyringeDependencyRegistryEngine._instance =
        new TsyringeDependencyRegistryEngine();
    }

    return TsyringeDependencyRegistryEngine._instance;
  }

  public addService<T>(classType: T): void {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    this._serviceSet.add(classType);
    const clazz = classType as unknown as new () => InstanceOf<T>;
    if (this.useToken) {
      if (!this.factory) {
        throw new Error("Unable to init tokenization without instance factory");
      }
      const instanceCashingSingletonFactory: FactoryFunction<unknown> =
        this.getInstanceCashingSingletonFactory(clazz);
      this.injector.register(TsyringeDependencyRegistryEngine.token, {
        useFactory: instanceCashingSingletonFactory,
      });
    } else {
      this.injector.registerSingleton(clazz);
    }
  }

  public clearAllServices(): void {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    this.injector.clearInstances();
  }

  public getService<T>(classType: T): InstanceOf<T> | null {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    const clazz = classType as unknown as new () => InstanceOf<T>;
    if (this.useToken && !this.injector.isRegistered(clazz)) {
      return (
        (this.injector
          .resolveAll(TsyringeDependencyRegistryEngine.token)
          .find(
            (instance) =>
              (instance as Record<string, unknown>).constructor === clazz,
          ) as InstanceOf<T>) ?? null
      );
    }
    return this.injector.resolve(clazz);
  }

  public getAllServices(): Set<unknown> {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }

    if (this.useToken) {
      return new Set(
        this.injector.resolveAll(TsyringeDependencyRegistryEngine.token),
      );
    }

    const retSet = new Set<unknown>();
    for (const classRef of this._serviceSet) {
      retSet.add(this.injector.resolve(classRef as constructor<unknown>));
    }

    return retSet;
  }

  public setToken(token: symbol): this {
    TsyringeDependencyRegistryEngine.token = token;
    return this;
  }

  public setCashingSingletonFactory(factory: Factory): this {
    this.factory = factory;
    return this;
  }

  private getInstanceCashingSingletonFactory<T>(
    clazz: InjectionToken<T>,
  ): FactoryFunction<T> {
    if (!this.factory) {
      throw new Error("Unable to init tokenization without instance factory");
    }
    return this.factory((c) => {
      if (!c.isRegistered(clazz)) {
        c.registerSingleton(clazz as constructor<T>);
      }
      return c.resolve(clazz);
    });
  }
}
