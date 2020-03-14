import {
  IOn,
  IDecorator,
  IInstance,
  IGuard
} from "..";
import { Client } from "discord.js";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _ons: IDecorator<IOn>[] = [];
  private _guards: IDecorator<IGuard>[] = [];
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

  AddGuard(guard: IDecorator<IGuard>) {
    this._guards.push(guard);
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
      on.params.guards = this._guards.reverse().filter((guard) => {
        return (
          guard.class === on.class &&
          guard.params.method === on.params.method
        );
      }, []);

      on.params.guardFn = async (client: Client, ...params: any) => {
        let res = true;
        for (const fn of on.params.guards) {
          if (res) {
            res = await fn.params.fn(...params, client);
          } else {
            break;
          }
        }
        return res;
      };

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
