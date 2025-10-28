/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
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

export type InstanceOf<T> = T extends new (
  ...args: unknown[]
) => infer R
  ? R
  : unknown;

export declare type Constructable<T> = new (...args: any[]) => T;

/**
 * The dependency injection service creates a single instance of a class and stores it globally using the singleton design pattern
 *
 * @category Internal
 */
// biome-ignore lint/complexity/noStaticOnlyClass: ignore
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
    return DIService.engine;
  }
}
