/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyContainer, Lifecycle } from "tsyringe";
import { InstanceOf } from "../..";

/**
 * It create on instance of a classe and store it globally using
 * the singleton design pattern
 * @category Internal
 */
export class DIService {
  private static _instance: DIService;
  private static _container?: DependencyContainer;

  static get container(): DependencyContainer | undefined {
    return this._container;
  }

  static set container(container: DependencyContainer | undefined) {
    this._container = container;
  }

  static get instance(): DIService {
    if (!this._instance) {
      this._instance = new DIService();
    }
    return this._instance;
  }

  private _services: Map<any, InstanceType<any>> = new Map();

  addService<ClassType>(classType: ClassType): InstanceOf<ClassType> {
    const myClass = classType as unknown as new () => InstanceOf<ClassType>;
    if (DIService.container) {
      DIService.container.register(
        myClass,
        { useClass: myClass },
        { lifecycle: Lifecycle.Singleton } // <- this is important
      );
      return DIService.container.resolve(myClass);
    } else {
      const instance = new myClass();
      this._services.set(classType, instance);
      return instance;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getService<ClassType>(classType: any): InstanceOf<ClassType> {
    if (DIService.container) {
      return DIService.container.resolve(classType) as InstanceOf<ClassType>;
    }
    return this._services.get(classType);
  }
}
