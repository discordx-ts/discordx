import { DSlash, DOption } from "..";
import { Decorator } from "./Decorator";

export class DGroup<InfoType = DSlash | DOption> extends Decorator {
  private _name: string;
  private _infos?: Partial<InfoType>;

  protected constructor(name: string, infos?: Partial<InfoType>) {
    super();
    this._name = name;
    this._infos = infos;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get infos() {
    return this._infos;
  }
  set infos(value) {
    this._infos = value;
  }

  static create<InfoType = DSlash | DOption>(
    name: string,
    infos?: Partial<InfoType>
  ) {
    return new DGroup<InfoType>(name.toLowerCase(), infos);
  }
}
