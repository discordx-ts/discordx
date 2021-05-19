import {
  Expression,
  Commandable,
  InfosType,
  ArgsRulesFunction,
  ExpressionFunction,
  RuleBuilder,
  Rule,
  CommandMessage,
  CommandInfos,
} from "../..";
import { DOn } from "./DOn";

export class DCommand extends DOn implements Commandable {
  protected _rules: (Expression | ExpressionFunction)[] = [];
  protected _normalizedRules: ExpressionFunction[] = [];
  protected _infos: InfosType = {};
  protected _params: string[] = [];

  get params() {
    return this._params;
  }
  set params(value) {
    this._params = value;
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

  get name() {
    return this._infos.name;
  }

  get rules() {
    return this._rules;
  }
  set rules(value) {
    this._rules = value;
    this.update();
  }

  get normalizedRules() {
    return this._normalizedRules;
  }

  get commandInfos(): CommandInfos {
    return {
      name: this.infos.name,
      description: this.description,
      infos: this.infos,
      rules: this.normalizedRules,
      prefix: this.linkedDiscord.prefix,
    };
  }

  static createCommand(
    rule?: Expression | ExpressionFunction,
    params?: string[]
  ) {
    const command = new DCommand();

    command.rules = [];
    if (Array.isArray(rule)) {
      command.rules = rule;
    } else {
      command.rules = [rule];
    }

    command.params = params || [];
    command._event = "message";
    command._once = false;

    return command;
  }

  update() {
    this._normalizedRules = this.rules.map((rule) =>
      RuleBuilder.normalize(
        rule,
        (str) => Rule(str).escape().spaceOrEnd(),
        (regexRule) => regexRule.spaceOrEnd().setFlags(regexRule.flags),
        (rule) => rule.spaceOrEnd().setFlags(rule.flags)
      )
    );

    if (!this._infos.name) {
      this._infos.name = this._key;
    }
  }
}
