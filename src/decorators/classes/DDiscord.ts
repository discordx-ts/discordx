import { Decorator } from "./Decorator";
import {
  DCommandNotFound,
  Commandable,
  Expression,
  ArgsRules,
  InfosType,
  FlatArgsRulesFunction
} from "../..";

export class DDiscord extends Decorator implements Commandable<Expression> {
  protected _argsRules: ArgsRules[];
  protected _commandNotFound?: DCommandNotFound;
  protected _instance?: Function;
  protected _originalRules: Partial<Commandable> = {};
  protected _infos: InfosType = {};
  protected _prefix: Expression | FlatArgsRulesFunction;

  get originalRules() {
    return this._originalRules;
  }

  get description() {
    return this._infos.description;
  }

  get prefix() {
    return this._prefix;
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

  get instance() {
    return this._instance;
  }

  get commandNotFound() {
    return this._commandNotFound;
  }
  set commandNotFound(value: DCommandNotFound) {
    this._commandNotFound = value;
  }

  static createDiscord(
    initialArgsRules: ArgsRules[],
    prefix: Expression | FlatArgsRulesFunction
  ) {
    const discord = new DDiscord();

    discord._argsRules = initialArgsRules;
    discord._prefix = prefix;

    return discord;
  }
}
