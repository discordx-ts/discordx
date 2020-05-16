import {
  Expression,
  Commandable,
  InfosType,
  ArgsRules
} from "../../";
import { DOn } from "./DOn";

export class DCommand extends DOn implements Commandable<Expression> {
  protected _argsRules: ArgsRules[];
  protected _originalRules: Partial<Commandable> = {};
  protected _infos: InfosType = {};

  get originalRules() {
    return this._originalRules;
  }

  get infos() {
    return this._infos;
  }
  set infos(value) {
    this._infos = value;
  }

  get argsRules() {
    return this._argsRules;
  }
  set argsRules(value) {
    this._argsRules = value;
  }

  static createCommand(
    initialArgsRule: ArgsRules[]
  ) {
    const command = new DCommand();
    command._argsRules = initialArgsRule;

    command._event = "message";
    command._once = false;

    return command;
  }
}
