import {
  IOn,
  IDecorator
} from "..";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _ons: IDecorator<IOn>[] = [];

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

  private getReadonlyArray<Type>(array: Type[]) {
    return array as ReadonlyArray<Type>;
  }
}
