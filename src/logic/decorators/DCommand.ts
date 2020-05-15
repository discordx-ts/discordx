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

export class DCommand extends DOn implements Commandable<RuleBuilder> {
  protected _message: RuleBuilder;
  protected _commandName: RuleBuilder;
  protected _prefix: RuleBuilder;
  protected _argsRules: RuleBuilder[];
  protected _argsSeparator: RuleBuilder;
  protected _infos?: any;
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

    command._originalRules = {
      prefix,
      argsRules,
      argsSeparator,
      message,
      commandName
    };

    command._prefix = Rule(prefix);
    command._message = Rule(message);
    command._commandName = Rule(commandName);
    command._argsSeparator = Rule(argsSeparator);
    command._argsRules = RuleBuilder.fromArray(argsRules);

    command._infos = infos;
    command._event = "message";
    command._once = false;

    return command;
  }
}
