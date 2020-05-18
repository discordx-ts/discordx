import { Message } from "discord.js";
import {
  CommandInfos,
  Expression,
  ExpressionFunction,
  ArgsRulesFunction,
  InfosType,
  DiscordInfos,
  DDiscord,
  DCommand
} from "../..";

export class CommandMessage<InfoType extends InfosType = any> extends Message implements CommandInfos<InfoType, Expression> {
  private _prefix: Expression | ExpressionFunction;
  private _commandName: Expression | ExpressionFunction;
  private _description: string;
  private _infos: InfoType;
  private _argsRules: ArgsRulesFunction<Expression>[];
  private _discord: DiscordInfos;
  private _args: string[];

  get args() {
    return this._args;
  }

  get prefix() {
    return this._prefix;
  }

  get commandName() {
    return this._commandName;
  }

  get description() {
    return this._description;
  }

  get infos() {
    return this._infos;
  }

  get argsRules() {
    return this._argsRules;
  }

  get discord() {
    return this._discord;
  }

  static create<InfoType extends InfosType = any>(
    message: Message,
    command: DCommand
  ) {
    const commandMessage = message as CommandMessage<InfoType>;

    commandMessage._infos = command.commandInfos.infos;
    commandMessage._prefix = command.commandInfos.prefix;
    commandMessage._argsRules = command.commandInfos.argsRules;
    commandMessage._commandName = command.commandInfos.commandName;
    commandMessage._description = command.commandInfos.description;
    commandMessage._discord = command.linkedDiscord.discordInfos;
    commandMessage._args = message.content.split(/\s{1,}/g);

    return commandMessage;
  }
}
