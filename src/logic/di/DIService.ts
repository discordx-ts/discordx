import { InstanceOf } from "../..";

export class DIService {
  private static _instance: DIService;

  static get instance() {
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

  getService<ClassType>(classType: any): InstanceOf<ClassType> {
    return this._services.get(classType);
  }
}
