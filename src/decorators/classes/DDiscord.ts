import { Decorator } from "./Decorator";
import {
  DCommandNotFound,
  Commandable,
  Expression,
  InfosType,
  ExpressionFunction,
  RuleBuilder,
  Rule,
  DiscordInfos,
  DGuard,
} from "../..";

export class DDiscord extends Decorator implements Commandable {
  protected _rules: (Expression | ExpressionFunction)[] = [];
  protected _normalizedRules: ExpressionFunction[] = [];
  protected _guards: DGuard[] = [];
  protected _commandNotFound?: DCommandNotFound;
  protected _instance?: Function;
  protected _infos: InfosType = {};
  protected _prefix: ExpressionFunction;

  get prefix() {
    return this._prefix;
  }
  set prefix(value) {
    this._prefix = value;
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
  set description(value) {
    this._infos.description = value;
  }

  get name() {
    return this._infos.name;
  }
  set name(value) {
    this._infos.name = value;
  }

  get rules() {
    return this._rules;
  }
  set rules(value) {
    this._rules = value;
  }

  get guards() {
    return this._guards;
  }
  set guards(value) {
    this._guards = value;
  }

  get normalizedRules() {
    return this._normalizedRules;
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

  get discordInfos(): DiscordInfos {
    return {
      name: this.name,
      description: this.description,
      infos: this.infos,
      rules: this.normalizedRules,
      prefix: this.prefix,
    };
  }

  static createDiscord(prefix: Expression | ExpressionFunction, name: string) {
    const discord = new DDiscord();

    discord._prefix = RuleBuilder.normalize(
      prefix,
      (str) => Rule().startWith(Rule(str).escape()),
      (regexRule) => Rule().startWith(regexRule).setFlags(regexRule.flags),
      (rule) => Rule().startWith(rule).setFlags(rule.flags)
    );

    discord.name = name;

    return discord;
  }
}
