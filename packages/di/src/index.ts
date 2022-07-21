import {
  DefaultDependencyRegistryEngine,
  TsyringeDependencyRegistryEngine,
  TypeDiDependencyRegistryEngine,
} from "./logic/impl/index.js";
import type { IDependencyRegistryEngine } from "./logic/index.js";

export * from "./logic/index.js";

// util instances of built-in engines
export const typeDiDependencyRegistryEngine =
  TypeDiDependencyRegistryEngine.instance;
export const tsyringeDependencyRegistryEngine =
  TsyringeDependencyRegistryEngine.instance;
export const defaultDependencyRegistryEngine =
  DefaultDependencyRegistryEngine.instance;

export type InstanceOf<T> = T extends new (...args: unknown[]) => infer R
  ? R
  : unknown;

/**
 * The dependency injection service creates a single instance of a class and stores it globally using the singleton design pattern
 *
 * @category Internal
 */
export class DIService {
  private static _diEngineToUse: IDependencyRegistryEngine =
    defaultDependencyRegistryEngine;

  private static _instance: DIService;

  static get engine(): IDependencyRegistryEngine {
    return DIService._diEngineToUse;
  }

  static set engine(engine: IDependencyRegistryEngine) {
    DIService._diEngineToUse = engine;
  }

  static get instance(): DIService {
    if (!this._instance) {
      this._instance = new DIService();
    }
    return this._instance;
  }

  /**
   * Get all Discord service classes
   * @returns {Set<unknown>}
   */
  static get allServices(): Set<unknown> {
    return DIService.engine.getAllServices();
  }

  /**
   * Add a service from the IOC container.
   * @param {T} classType - The type of service to add
   */
  addService<T>(classType: T): void {
    DIService.engine.addService(classType);
  }

  /**
   * Get a service from the IOC container
   * @param {T} classType - the Class of the service to retrieve
   * @returns {InstanceOf<T> | null} the instance of this service or null if there is no instance
   */
  getService<T>(classType: T): InstanceOf<T> | null {
    return DIService.engine.getService(classType);
  }
}
