import type { InstanceOf } from "../../index.js";
import type { IDependencyRegistryEngine } from "../IDependencyRegistryEngine.js";

export class DefaultDependencyRegistryEngine
  implements IDependencyRegistryEngine
{
  private static _instance: DefaultDependencyRegistryEngine;
  private _services = new Map();

  public static get instance(): DefaultDependencyRegistryEngine {
    if (!DefaultDependencyRegistryEngine._instance) {
      DefaultDependencyRegistryEngine._instance =
        new DefaultDependencyRegistryEngine();
    }

    return DefaultDependencyRegistryEngine._instance;
  }

  public getAllServices(): Set<unknown> {
    return new Set(this._services.values());
  }

  public addService<T>(classType: T): void {
    const clazz = classType as unknown as new () => InstanceOf<T>;
    const instance = new clazz();
    this._services.set(clazz, instance);
  }

  public getService<T>(classType: T): InstanceOf<T> {
    return this._services.get(classType);
  }
}
