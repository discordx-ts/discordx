import {
  IOn,
  IDecorator,
  IInstance
} from "..";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _ons: IDecorator<IOn>[] = [];
  private _instances: IDecorator<IInstance>[] = [];

  static get Instance() {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }

  get Ons() {
    return this.getReadonlyArray(this._ons);
  }

  AddOn(on: IDecorator<IOn>) {
    this._ons.push(on);
  }

  AddInstance(classType: IDecorator<any>) {
    this._instances.push({
      ...classType,
      params: {
        instance: new classType.class()
      }
    });
  }

  Build() {
    this._ons.map((on) => {
      const instance = this._instances.find((instance) => instance.class === on.class);
      if (instance) {
        on.params.linkedInstance = instance.params;
      }
    });
  }

  private getReadonlyArray<Type>(array: Type[]) {
    return array as ReadonlyArray<Type>;
  }
}
