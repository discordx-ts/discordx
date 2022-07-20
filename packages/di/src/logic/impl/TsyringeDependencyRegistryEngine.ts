import type { DependencyContainer } from "tsyringe";
import type { constructor } from "tsyringe/dist/typings/types/index.js";

import type { InstanceOf } from "../../index.js";
import { AbstractConfigurableDependencyInjector } from "../AbstractConfigurableDependencyInjector.js";

export class TsyringeDependencyRegistryEngine extends AbstractConfigurableDependencyInjector<DependencyContainer> {
  public static readonly token = Symbol("discordx");

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
    const clazz = classType as unknown as new () => InstanceOf<T>;
    if (this.useToken) {
      this.injector.registerSingleton(
        TsyringeDependencyRegistryEngine.token,
        clazz
      );
      return;
    }
    this._serviceSet.add(classType);
    this.injector.registerSingleton(clazz);
  }

  public getService<T>(classType: T): InstanceOf<T> | null {
    if (!this.injector) {
      throw new Error("Please set the container!");
    }
    const clazz = classType as unknown as new () => InstanceOf<T>;
    if (this.useToken) {
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
}
