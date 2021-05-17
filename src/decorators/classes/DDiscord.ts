import { Decorator } from "./Decorator";
import {
  DCommandNotFound,
  Commandable,
  Expression,
  ArgsRulesFunction,
  InfosType,
  ExpressionFunction,
  RuleBuilder,
  CommandMessage,
  Rule,
  DiscordInfos,
} from "../..";

export class DDiscord extends Decorator implements Commandable {
  protected _rules: (Expression | ExpressionFunction)[] = [];
  protected _normalizedRules: ExpressionFunction[] = [];
  protected _commandNotFound?: DCommandNotFound;
  protected _instance?: Function;
  protected _infos: InfosType = {};
  protected _prefix: ExpressionFunction;

  get description() {
    return this._infos.description;
  }

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

  get rules() {
    return this._rules;
  }
  set rules(value) {
    this._rules = value;
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
      description: this.description,
      infos: this.infos,
      rules: this.normalizedRules,
      prefix: this.prefix,
    };
  }

  static createDiscord(prefix: Expression | ExpressionFunction) {
    const discord = new DDiscord();

    discord._prefix = RuleBuilder.normalize(prefix, (str) => Rule().startWith(str));

    return discord;
  }
}
