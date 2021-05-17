import { Message } from "discord.js";
import {
  CommandInfos,
  Expression,
  ExpressionFunction,
  InfosType,
  DiscordInfos,
  DCommand,
  Client,
  RuleBuilder,
  Rule,
} from "../..";

export class CommandMessage<
  ParamsType extends {[key: string]: any} = {},
  InfoType extends InfosType = any
>
  extends Message
  implements CommandInfos<InfoType>
{
  prefix: ExpressionFunction;
  name: string;
  description: string;
  infos: InfoType;
  rules: ExpressionFunction[];
  discord: DiscordInfos;
  params: ParamsType;
  values: string[];
  paramsNames: string[];
  commandContent: string;

  static create<
    ParamsType extends {[key: string]: any} = {},
    InfoType extends InfosType = any>
  (
    message: Message,
    command: DCommand
  ) {
    const commandMessage = { ...message } as CommandMessage<ParamsType, InfoType>;

    commandMessage.infos = command.commandInfos.infos;
    commandMessage.prefix = command.commandInfos.prefix;
    commandMessage.rules = command.normalizedRules;
    commandMessage.name = command.name;
    commandMessage.description = command.description;
    commandMessage.discord = command.linkedDiscord.discordInfos;
    commandMessage.values = commandMessage.content.split(/\s+/);

    commandMessage.paramsNames = command.params;
    commandMessage.params = command.params.reverse().reduce<any>((prev, param, index) => {
      return {
        ...prev,
        [param]: commandMessage.values[commandMessage.values.length - index - 1]
      };
    }, {});

    return commandMessage;
  }

  static async pass(client: Client, commandMessage: CommandMessage): Promise<RuleBuilder[]> {
    const rules = await Promise.all(commandMessage.rules.map(async (rule) => {
      return await rule(commandMessage, client);
    }));

    return rules.reduce((prev, rule) => {
      if (!rule) {
        return prev;
      }

      const ruleBuilder = Rule(rule)
      if (ruleBuilder.test(commandMessage.content)) {
        return [
          ...prev,
          ruleBuilder
        ];
      }

      return prev;
    }, []);
  }
}
