import { Message } from "discord.js";
import {
  CommandInfos,
  Expression,
  ExpressionFunction,
  ArgsRulesFunction,
  InfosType,
  DiscordInfos,
  DCommand
} from "../..";

export class CommandMessage<InfoType extends InfosType = any> extends Message implements CommandInfos<InfoType, Expression> {
  prefix: Expression | ExpressionFunction;
  commandName: Expression | ExpressionFunction;
  description: string;
  infos: InfoType;
  argsRules: ArgsRulesFunction<Expression>[];
  discord: DiscordInfos;
  args: string[];

  static create<InfoType extends InfosType = any>(
    message: Message,
    command: DCommand
  ) {
    const commandMessage = message as CommandMessage<InfoType>;

    commandMessage.infos = command.commandInfos.infos;
    commandMessage.prefix = command.commandInfos.prefix;
    commandMessage.argsRules = command.commandInfos.argsRules;
    commandMessage.commandName = command.commandInfos.commandName;
    commandMessage.description = command.commandInfos.description;
    commandMessage.discord = command.linkedDiscord.discordInfos;
    commandMessage.args = message.content.split(/\s{1,}/g);

    return commandMessage;
  }
}
