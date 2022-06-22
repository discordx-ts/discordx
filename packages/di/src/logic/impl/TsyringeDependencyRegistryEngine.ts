import { container } from "tsyringe";

import type { InstanceOf } from "../../index.js";
import type { IDependencyRegistryEngine } from "../IDependencyRegistryEngine.js";

export class TsyringeDependencyRegistryEngine
  implements IDependencyRegistryEngine
{
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
    const clazz = classType as unknown as new () => InstanceOf<T>;
    container.registerSingleton(TsyringeDependencyRegistryEngine.token, clazz);
  }

  public getService<T>(classType: T): InstanceOf<T> | null {
    const clazz = classType as unknown as new () => InstanceOf<T>;
    return (
      (container
        .resolveAll(TsyringeDependencyRegistryEngine.token)
        .find((instance) => instance === clazz) as InstanceOf<T>) ?? null
    );
  }

  public getAllServices(): Set<unknown> {
    return new Set(
      container.resolveAll(TsyringeDependencyRegistryEngine.token)
    );
  }
}
