import type { DependencyContainer } from "tsyringe";
import type { Container } from "typedi";
import { Service } from "typedi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InstanceOf<T> = T extends new (...args: any[]) => infer R ? R : any;
export type DIServiceContainer = DependencyContainer | typeof Container;

/**
 * The dependency injection service creates a single instance of a class and stores it globally using the singleton design pattern
 *
 * @category Internal
 */
export class DIService {
  private static _instance: DIService;
  private static _container?: DIServiceContainer;

  static get container(): DIServiceContainer | undefined {
    return this._container;
  }

  static set container(container: DIServiceContainer | undefined) {
    this._container = container;
  }

  static get instance(): DIService {
    if (!this._instance) {
      this._instance = new DIService();
    }
    return this._instance;
  }

  private _services = new Map();
  private static _ServiceSet = new Set();

  /**
   * Get all the services from the DI container
   */
  static get allServices(): Set<unknown> {
    return DIService._ServiceSet;
  }

  addService<T>(classType: T): void {
    const myClass = classType as unknown as new () => InstanceOf<T>;
    DIService._ServiceSet.add(myClass);

    if (DIService.container) {
      if (this.isTsyringe(DIService.container)) {
        DIService.container.registerSingleton(myClass);
      } else {
        /*
          TypeDI classes MUST use @Service(), setting it on the container ONLY apply to tokenization, this is BY design.
          we call the decorator directly here.
         */
        Service()(myClass);
      }
    } else {
      const instance = new myClass();
      this._services.set(myClass, instance);
    }
  }

  getService<T>(classType: T): InstanceOf<T> {
    const myClass = classType as unknown as new () => InstanceOf<T>;

    if (DIService.container) {
      if (this.isTsyringe(DIService.container)) {
        return DIService.container.resolve(myClass);
      }
      return DIService.container.get(classType);
    }

    return this._services.get(classType);
  }

  private isTsyringe(
    diContainer: DIServiceContainer
  ): diContainer is DependencyContainer {
    return "registerSingleton" in diContainer;
  }
}
