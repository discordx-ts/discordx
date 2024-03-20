/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { InstanceOf } from "../index.js";

/**
 * Interface to facilitate the ability to add custom IOC containers by conforming to the proxy of adding and retrieval of services
 */
export interface IDependencyRegistryEngine {
  /**
   * Add a service from the IOC container.
   * @param {T} classType - The type of service to add
   */
  addService<T>(classType: T): void;

  /**
   * Clear all Discord service classes
   */
  clearAllServices(): void;

  /**
   * Get all Discord service classes
   * @returns {Set<unknown>}
   */
  getAllServices(): Set<unknown>;

  /**
   * Get a service from the IOC container
   * @param {T} classType - the Class of the service to retrieve
   * @returns {InstanceOf<T> | null} the instance of this service or null if there is no instance
   */
  getService<T>(classType: T): InstanceOf<T> | null;
}
