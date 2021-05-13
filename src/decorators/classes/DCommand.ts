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

  get commandInfos(): CommandInfos {
    return {
      description: this.description,
      infos: this.infos,
      argsRules: this.argsRules as ArgsRulesFunction<any>[],
      prefix: this.linkedDiscord.prefix,
      commandName: this.commandName,
    };
  }

  static createCommand(commandName?: Expression | ExpressionFunction) {
    const command = new DCommand();

    if (commandName) {
      let finalCommandName = commandName;

      if (RuleBuilder.typeOfExpression(finalCommandName) === String) {
        finalCommandName = RuleBuilder.escape(finalCommandName as string);
      }

      const escapedCommandName = finalCommandName;

      if (typeof escapedCommandName !== "function") {
        const expr = escapedCommandName as Expression;
        const isRuleBuilder = expr instanceof RuleBuilder;
        if (expr) {
          finalCommandName = isRuleBuilder
            ? () => expr
            : () => Rule(expr).spaceOrEnd();
        }
      }

      command._argsRules = [
        async (command: CommandMessage) => [
          await (finalCommandName as ExpressionFunction)(command),
        ],
      ];

      command._commandName = escapedCommandName;
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
