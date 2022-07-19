import { container } from "tsyringe";
import type { constructor } from "tsyringe/dist/typings/types/index.js";

import type { InstanceOf } from "../../index.js";
import type { IDependencyRegistryEngine } from "../IDependencyRegistryEngine.js";

export class TsyringeDependencyRegistryEngine
  implements IDependencyRegistryEngine
{
  public static readonly token = Symbol("discordx");

  private static useToken = false;

  private static _instance: TsyringeDependencyRegistryEngine;

  private _serviceSet = new Set<unknown>();

  public static get instance(): TsyringeDependencyRegistryEngine {
    if (!TsyringeDependencyRegistryEngine._instance) {
      TsyringeDependencyRegistryEngine._instance =
        new TsyringeDependencyRegistryEngine();
    }

    return TsyringeDependencyRegistryEngine._instance;
  }

  public set useTokenization(useToken: boolean) {
    TsyringeDependencyRegistryEngine.useToken = useToken;
  }

  public addService<T>(classType: T): void {
    const clazz = classType as unknown as new () => InstanceOf<T>;
    if (TsyringeDependencyRegistryEngine.useToken) {
      container.registerSingleton(
        TsyringeDependencyRegistryEngine.token,
        clazz
      );
      return;
    }
    this._serviceSet.add(classType);
    container.registerSingleton(clazz);
  }

  public getService<T>(classType: T): InstanceOf<T> | null {
    const clazz = classType as unknown as new () => InstanceOf<T>;
    return (
      (container
        .resolveAll(TsyringeDependencyRegistryEngine.token)
        .find(
          (instance) =>
            (instance as Record<string, unknown>).constructor === clazz
        ) as InstanceOf<T>) ?? null
    );
  }

  public getAllServices(): Set<unknown> {
    if (TsyringeDependencyRegistryEngine.useToken) {
      return new Set(
        container.resolveAll(TsyringeDependencyRegistryEngine.token)
      );
    }
    const retSet = new Set<unknown>();
    for (const classRef of this._serviceSet) {
      retSet.add(container.resolve(classRef as constructor<unknown>));
    }
    return retSet;
  }
}
