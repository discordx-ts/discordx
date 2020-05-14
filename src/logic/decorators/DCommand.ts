import {
  CommandParams,
  Expression,
  Decorator,
  RuleBuilder,
  Rule,
  Commandable,
  CommandableFactory
} from "../../";
import { DOn } from "./DOn";

export class DCommand extends DOn implements Commandable {
  protected _message: RuleBuilder;
  protected _commandName: RuleBuilder;
  protected _prefix: RuleBuilder;
  protected _argsRules: RuleBuilder[];
  protected _argsSeparator: RuleBuilder;
  protected _infos?: any;

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

  get infos() {
    return this.infos;
  }

  static createCommand(
    commandName: Expression,
    prefix?: Expression,
    message?: Expression,
    argsRules: Expression[] = [],
    argsSeparator: Expression = " ",
    infos?: any
  ) {
    const command = new DCommand();

    CommandableFactory.create(
      command,
      commandName,
      prefix,
      message,
      argsRules,
      argsSeparator
    );

    command._infos = infos;
    command.event = "message";
    command.once = false;

    return command;
  }
}
