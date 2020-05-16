import { Decorator } from "./Decorator";
import {
  DCommandNotFound,
  Commandable,
  Expression,
  Rule,
  RuleBuilder,
  ArgsRules,
  InfosType
} from "../..";

export class DDiscord extends Decorator implements Commandable<Expression> {
  protected _argsRules: ArgsRules[];
  protected _commandNotFound?: DCommandNotFound;
  protected _instance?: Function;
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
    initialArgsRules: ArgsRules[]
  ) {
    const discord = new DDiscord();
    discord._argsRules = initialArgsRules;
    return discord;
  }

  update() {
    this._instance = new (this.classRef as any)();
  }
}
