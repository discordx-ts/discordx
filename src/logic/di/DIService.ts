/* eslint-disable @typescript-eslint/no-explicit-any */
import { InstanceOf } from "../..";

/**
 * It create on instance of a classe and store it globaly using
 * the singleton design pattern
 * @category Internal
 */
export class DIService {
  private static _instance: DIService;

  static get instance(): DIService {
    if (!this._instance) {
      this._instance = new DIService();
    }
    return this._instance;
  }

  private _services: Map<any, InstanceType<any>> = new Map();

  addService<ClassType>(classType: ClassType): InstanceOf<ClassType> {
    const instance = new (classType as any)();
    this._services.set(classType, instance);
    return instance;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getService<ClassType>(classType: any): InstanceOf<ClassType> {
    return this._services.get(classType);
  }
}
