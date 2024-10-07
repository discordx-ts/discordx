/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { InstanceOf } from "../index.js";

/**
 * Interface to facilitate the ability to add custom IOC containers by conforming to the proxy of adding and retrieval of services
 */
export interface IDependencyRegistryEngine {
  /**
   * Add a service from the IOC container.
   * @param serviceConstructor - The type of service to add
   */
  addService(serviceConstructor: any): void;

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
