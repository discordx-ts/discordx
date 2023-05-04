import type {
  DependencyContainer,
  FactoryFunction,
  InjectionToken,
} from "tsyringe";
import { container, instanceCachingFactory } from "tsyringe";
import type { constructor } from "tsyringe/dist/typings/types/index.js";

import type { InstanceOf } from "../../index.js";
import { AbstractConfigurableDependencyInjector } from "../AbstractConfigurableDependencyInjector.js";

export class TsyringeDependencyRegistryEngine extends AbstractConfigurableDependencyInjector<DependencyContainer> {
  public static token = Symbol("discordx");

  private static _instance: TsyringeDependencyRegistryEngine;

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
    const instanceCashingSingletonFactory: FactoryFunction<unknown> =
        this.getInstanceCashingSingletonFactory(clazz);
    if (this.useToken) {
      this.injector.register(TsyringeDependencyRegistryEngine.token, {
        useFactory: instanceCashingSingletonFactory,
      });
    } else {
      this.injector.registerSingleton(clazz);
    }
  }

  public getService<T>(classType: T): InstanceOf<T> | null {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    const clazz = classType as unknown as new () => InstanceOf<T>;
    if (this.useToken && !container.isRegistered(clazz)) {
      return (
          (this.injector
              .resolveAll(TsyringeDependencyRegistryEngine.token)
              .find(
                  (instance) =>
                      (instance as Record<string, unknown>).constructor === clazz
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
          this.injector.resolveAll(TsyringeDependencyRegistryEngine.token)
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

  private getInstanceCashingSingletonFactory<T>(
      clazz: InjectionToken<T>
  ): FactoryFunction<T> {
    return instanceCachingFactory<T>((c) => {
      if (!c.isRegistered(clazz)) {
        c.registerSingleton(clazz as constructor<T>);
      }
      return c.resolve(clazz);
    });
  }
}
