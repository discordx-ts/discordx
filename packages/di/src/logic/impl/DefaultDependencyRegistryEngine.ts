/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { InstanceOf } from "../../index.js";
import type { IDependencyRegistryEngine } from "../IDependencyRegistryEngine.js";

export class DefaultDependencyRegistryEngine
  implements IDependencyRegistryEngine
{
  private static _instance: DefaultDependencyRegistryEngine | undefined;
  private _services = new Map();

  public static get instance(): DefaultDependencyRegistryEngine {
    DefaultDependencyRegistryEngine._instance ??=
      new DefaultDependencyRegistryEngine();
    return DefaultDependencyRegistryEngine._instance;
  }

  public addService(serviceConstructor: any): void {
    const service = new serviceConstructor();
    this._services.set(serviceConstructor, service);
  }

  public clearAllServices(): void {
    this._services.clear();
  }

  public getAllServices(): Set<unknown> {
    return new Set(this._services.values());
  }

  public getService<T>(classType: T): InstanceOf<T> {
    return this._services.get(classType) as InstanceOf<T>;
  }
}
