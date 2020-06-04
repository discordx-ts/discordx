import { Message } from "discord.js";
import {
  CommandInfos,
  Expression,
  ExpressionFunction,
  ArgsRulesFunction,
  InfosType,
  DiscordInfos,
  DCommand,
  Client,
  RuleBuilder,
  Rule
} from "../..";

export class CommandMessage<
  ArgsType = any,
  InfoType extends InfosType = any>
  extends Message implements CommandInfos<InfoType, Expression
>{
  prefix: Expression | ExpressionFunction;
  commandName: Expression | ExpressionFunction;
  description: string;
  infos: InfoType;
  argsRules: ArgsRulesFunction<Expression>[];
  discord: DiscordInfos;
  args: ArgsType;
  commandContent: string;

  static create<InfoType extends InfosType = any>(
    message: Message,
    command: DCommand
  ) {
    const commandMessage = message as CommandMessage<any, InfoType>;

    commandMessage.infos = command.commandInfos.infos;
    commandMessage.prefix = command.commandInfos.prefix;
    commandMessage.argsRules = command.commandInfos.argsRules;
    commandMessage.commandName = command.commandInfos.commandName;
    commandMessage.description = command.commandInfos.description;
    commandMessage.discord = command.linkedDiscord.discordInfos;
    commandMessage.args = {};

    return commandMessage;
  }

  static parseArgs(expression: RuleBuilder[], message: CommandMessage) {
    const excludeSpecialChar = /[^\w]/gi;
    const splitSpaces = /\s{1,}/g;

    const originalArgsNames = expression[1].source.match(Client.variablesExpression) || [];
    const argsValues = message.content.replace(expression[0].regex, "").split(splitSpaces).filter(i => i);

    originalArgsNames.map((argName, index) => {
      const normalized = argName.replace(excludeSpecialChar, "").trim();
      const value = argsValues[index];
      const numberValue = Number(value);

      message.args[normalized] = Number.isNaN(numberValue) ? value : numberValue;
    });
  }
}
