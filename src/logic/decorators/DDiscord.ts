import { Decorator } from "./Decorator";
import {
  DCommandNotFound,
  Commandable,
  Expression,
  Rule,
  RuleBuilder
} from "../..";

export class DDiscord extends Decorator implements Commandable {
  protected _message: Expression;
  protected _commandName: Expression;
  protected _prefix: Expression;
  protected _argsRules: Expression[];
  protected _argsSeparator: Expression;
  protected _commandNotFound?: DCommandNotFound;
  protected _instance?: Function;
  protected _originalRules: Partial<Commandable> = {};

  get originalRules() {
    return this._originalRules;
  }

  get commandName() {
    return this._commandName;
  }
  set commandName(value) {
    this._commandName = value;
  }

  get prefix() {
    return this._prefix;
  }
  set prefix(value) {
    this._prefix = value;
  }

  get message() {
    return this._message;
  }
  set message(value) {
    this._message = value;
  }

  get argsRules() {
    return this._argsRules;
  }
  set argsRules(value) {
    this._argsRules = value;
  }

  get argsSeparator() {
    return this._argsSeparator;
  }
  set argsSeparator(value) {
    this._argsSeparator = value;
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
    message?: Expression,
    prefix?: Expression,
    argsRules: Expression[] = [],
    argsSeparator: Expression = " "
  ) {
    const discord = new DDiscord();

    discord._originalRules = {
      prefix,
      argsRules,
      argsSeparator,
      message
    };

    discord._prefix = Rule(prefix);
    discord._message = Rule(message);
    discord._argsSeparator = Rule(argsSeparator);
    discord._argsRules = RuleBuilder.fromArray(argsRules);

    return discord;
  }

  update() {
    this._instance = new (this.classRef as any)();
  }
}
