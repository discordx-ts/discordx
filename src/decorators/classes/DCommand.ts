import {
  Expression,
  Commandable,
  InfosType,
  ArgsRules,
  FlatArgsRulesFunction
} from "../..";
import { DOn } from "./DOn";

export class DCommand extends DOn implements Commandable<Expression> {
  protected _argsRules: ArgsRules[];
  protected _originalRules: Partial<Commandable> = {};
  protected _infos: InfosType = {};
  protected _commandName: Expression | FlatArgsRulesFunction;

  get originalRules() {
    return this._originalRules;
  }

  get infos() {
    return this._infos;
  }
  set infos(value) {
    this._infos = value;
  }

  get description() {
    return this._infos.description;
  }

  get argsRules() {
    return this._argsRules;
  }
  set argsRules(value) {
    this._argsRules = value;
  }

  get commandName() {
    return this._commandName;
  }

  static createCommand(
    initialArgsRule: ArgsRules[],
    commandName: Expression | FlatArgsRulesFunction
  ) {
    const command = new DCommand();

    command._argsRules = initialArgsRule;
    command._commandName = commandName;
    command._event = "message";
    command._once = false;

    return command;
  }
}
