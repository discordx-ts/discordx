import { DOn } from "./DOn";
import { InfosType } from "../..";

export class DCommandNotFound extends DOn {
  private _infos: InfosType;

  get infos() {
    return this._infos;
  }
  set infos(value) {
    this._infos = value;
  }

  get description() {
    return this._infos.description;
  }

  static createCommandNotFound() {
    const cnf = new DCommandNotFound();

    cnf._infos = {};
    cnf._event = "message";
    cnf._once = false;

    return cnf;
  }
}
