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

export class DDiscord extends Decorator implements Commandable<Expression> {
  protected _argsRules: ArgsRulesFunction[];
  protected _commandNotFound?: DCommandNotFound;
  protected _instance?: Function;
  protected _originalRules: Partial<Commandable> = {};
  protected _infos: InfosType = {};
  protected _prefix: Expression | ExpressionFunction;

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

  get discordInfos(): DiscordInfos {
    return {
      description: this.description,
      infos: this.infos,
      argsRules: this.argsRules,
      prefix: this.prefix,
    };
  }

  static createDiscord(prefix: Expression | ExpressionFunction) {
    const discord = new DDiscord();

    let finalPrefix = prefix;

    if (RuleBuilder.typeOfExpression(prefix) === String) {
      finalPrefix = RuleBuilder.escape(prefix as string);
    }

    const escapedPrefix = finalPrefix;

    if (typeof escapedPrefix !== "function") {
      const isRuleBuilder = escapedPrefix instanceof RuleBuilder;
      finalPrefix = isRuleBuilder
        ? () => escapedPrefix as Expression
        : () => Rule().startWith(escapedPrefix as Expression);
    }

    discord._argsRules = [
      async (command: CommandMessage) => [
        await (finalPrefix as ExpressionFunction)(command),
      ],
    ];
    discord._prefix = escapedPrefix;

    return discord;
  }
}
