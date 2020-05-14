import { Decorator } from "./Decorator";
import {
  DCommandNotFound,
  Commandable,
  RuleBuilder,
  Expression,
  CommandableFactory
} from "../..";

export class DDiscord extends Decorator implements Commandable {
  protected _message: RuleBuilder;
  protected _commandName: RuleBuilder;
  protected _prefix: RuleBuilder;
  protected _argsRules: RuleBuilder[];
  protected _argsSeparator: RuleBuilder;
  protected _commandNotFound?: DCommandNotFound;
  protected _instance?: Function;

  get commandName() {
    return this._commandName;
  }
  set commandName(value: RuleBuilder) {
    this._commandName = value;
  }

  get prefix() {
    return this._prefix;
  }
  set prefix(value: RuleBuilder) {
    this._prefix = value;
  }

  get message() {
    return this._message;
  }
  set message(value: RuleBuilder) {
    this._message = value;
  }

  get argsRules() {
    return this._argsRules;
  }
  set argsRules(value: RuleBuilder[]) {
    this._argsRules = value;
  }

  get argsSeparator() {
    return this._argsSeparator;
  }
  set argsSeparator(value: RuleBuilder) {
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
    commandName?: Expression,
    message?: Expression,
    prefix?: Expression,
    argsRules: Expression[] = [],
    argsSeparator: Expression = " "
  ) {
    const discord = new DDiscord();

    CommandableFactory.create(
      discord,
      commandName,
      prefix,
      message,
      argsRules,
      argsSeparator
    );

    return discord;
  }

  update() {
    this._instance = new (this.classRef as any)();
  }
}
