/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
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
  private static _engine: IDependencyRegistryEngine =
    defaultDependencyRegistryEngine;

  static get engine(): IDependencyRegistryEngine {
    return DIService._engine;
  }

  static set engine(engine: IDependencyRegistryEngine) {
    DIService._engine = engine;
  }

  /**
   * @deprecated use DIService.engine instead
   */
  static get instance(): IDependencyRegistryEngine {
    return this.engine;
  }

  private constructor() {
    // empty constructor
  }
}
