import {
  Expression,
  Commandable,
  InfosType,
  ArgsRulesFunction,
  ExpressionFunction,
  RuleBuilder,
  Rule,
  CommandMessage
} from "../..";
import { DOn } from "./DOn";

export class DCommand extends DOn implements Commandable<Expression> {
  protected _argsRules: ArgsRulesFunction[];
  protected _originalRules: Partial<Commandable> = {};
  protected _infos: InfosType = {};
  protected _commandName: Expression | ExpressionFunction;

  get originalRules() {
    return this._originalRules;
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

  get argsRules() {
    return this._argsRules;
  }
  set argsRules(value) {
    this._argsRules = value;
  }

  get commandName() {
    return this._commandName;
  }

  static createCommand(
    commandName?: Expression | ExpressionFunction
  ) {
    const command = new DCommand();

    if (commandName) {
      let finalCommandName = commandName as ExpressionFunction;

      if (typeof commandName !== "function") {
        const expr = commandName as Expression;
        const isRuleBuilder = expr instanceof RuleBuilder;
        if (expr) {
          finalCommandName = isRuleBuilder ? () => expr : () => Rule(expr).spaceOrEnd();
        }
      }

      command._argsRules = [
        async (command: CommandMessage) => [await finalCommandName(command)]
      ];

      command._commandName = commandName;
    } else {
      command._argsRules = [];
    }

    command._event = "message";
    command._once = false;

    return command;
  }

  update() {
    if (!this._commandName) {
      this._commandName = this._key;
    }
  }
}
