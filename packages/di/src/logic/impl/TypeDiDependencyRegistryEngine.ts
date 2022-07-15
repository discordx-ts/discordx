import type { Container, Service } from "typedi";
import { Token } from "typedi";

import type { InstanceOf } from "../../index.js";
import { AbstractConfigurableDependencyInjector } from "../AbstractConfigurableDependencyInjector.js";

export class TypeDiDependencyRegistryEngine extends AbstractConfigurableDependencyInjector<
  typeof Container
> {
  public static readonly token = new Token<unknown>("discordx");

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
    this.service({
      id: TypeDiDependencyRegistryEngine.token,
      multiple: true,
    })(clazz);
  }

  public setService(service: typeof Service): this {
    this.service = service;
    return this;
  }

  public getAllServices(): Set<unknown> {
    if (!this.injector) {
      throw new Error("Please set the Service!");
    }
    return new Set(this.injector.getMany(TypeDiDependencyRegistryEngine.token));
  }

  public getService<T>(classType: T): InstanceOf<T> | null {
    if (!this.injector) {
      throw new Error("Please set the Service!");
    }
    return (
      (this.injector
        .getMany(TypeDiDependencyRegistryEngine.token)
        .find(
          (clazz) =>
            ((clazz as Record<string, unknown>).constructor as unknown as T) ===
            classType
        ) as InstanceOf<T>) ?? null
    );
  }
}
