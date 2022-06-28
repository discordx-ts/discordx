import { Container, Service, Token } from "typedi";

import type { InstanceOf } from "../../index.js";
import type { IDependencyRegistryEngine } from "../IDependencyRegistryEngine.js";

export class TypeDiDependencyRegistryEngine
  implements IDependencyRegistryEngine
{
  public static readonly token = new Token<unknown>("discordx");

  private static _instance: TypeDiDependencyRegistryEngine;

  public static get instance(): TypeDiDependencyRegistryEngine {
    if (!TypeDiDependencyRegistryEngine._instance) {
      TypeDiDependencyRegistryEngine._instance =
        new TypeDiDependencyRegistryEngine();
    }

    return TypeDiDependencyRegistryEngine._instance;
  }

  public addService<T>(classType: T): void {
    const clazz = classType as unknown as new () => InstanceOf<T>;
    Service({
      id: TypeDiDependencyRegistryEngine.token,
      multiple: true,
    })(clazz);
  }

  public getAllServices(): Set<unknown> {
    return new Set(Container.getMany(TypeDiDependencyRegistryEngine.token));
  }

  public getService<T>(classType: T): InstanceOf<T> | null {
    return (
      (Container.getMany(TypeDiDependencyRegistryEngine.token).find(
        (clazz) =>
          ((clazz as Record<string, unknown>).constructor as unknown as T) ===
          classType
      ) as InstanceOf<T>) ?? null
    );
  }
}
