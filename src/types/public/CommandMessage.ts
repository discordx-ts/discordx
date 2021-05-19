import { Message } from "discord.js";
import {
  InfosType,
  DiscordInfos,
  DCommand,
  Client,
  RuleBuilder,
  Rule,
} from "../..";

export class CommandMessage<
  ParamsType extends { [key: string]: any } = {},
  InfoType extends InfosType = any
> {
  prefix: RuleBuilder;
  name: string;
  description: string;
  infos: InfoType;
  rules: RuleBuilder[] = [];
  discord: DiscordInfos;
  params: ParamsType = {} as any;
  values: string[] = [];
  paramsNames: string[] = [];
  paramsValues: string[] = [];
  paramsString: string;
  commandContent: string;
  client: Client;
  message: Message;
  content: string;
  id: string;

  static async create<
    ParamsType extends { [key: string]: any } = {},
    InfoType extends InfosType = any
  >(message: Message, command: DCommand, client: Client) {
    const commandMessage = new CommandMessage<ParamsType, InfoType>();

    commandMessage.message = message;
    commandMessage.id = message.id;

    commandMessage.content = message.content;
    commandMessage.infos = command.commandInfos.infos;
    commandMessage.name = command.name;
    commandMessage.description = command.description;
    commandMessage.discord = command.linkedDiscord.discordInfos;
    commandMessage.values = commandMessage.content.split(/\s+/);
    commandMessage.paramsNames = command.params;
    commandMessage.client = client;

    const prefixExpr = await command.linkedDiscord.prefix(
      commandMessage,
      client
    );
    commandMessage.prefix = Rule(prefixExpr);

    commandMessage.rules = await Promise.all(
      command.normalizedRules.map(async (rule) => {
        const expr = Rule(await rule(commandMessage, client));
        return commandMessage.prefix.copy().add(expr).setFlags(expr.flags);
      })
    );

    commandMessage.paramsString = message.content;
    commandMessage.rules.map((rule) => {
      commandMessage.paramsString = commandMessage.paramsString.replace(
        rule.regex,
        ""
      );
    });

    commandMessage.params = command.params.reduce<any>((prev, param, index) => {
      return {
        ...prev,
        [param]: undefined,
      };
    }, {});

    if (!commandMessage.paramsString) {
      return commandMessage;
    }

    commandMessage.paramsValues = commandMessage.paramsString.split(/\s+/i);

    commandMessage.params = command.params.reduce<any>((prev, param, index) => {
      const value = commandMessage.paramsValues[index];
      const numberValue = value === undefined ? undefined : Number(value);
      return {
        ...prev,
        [param]: Number.isNaN(numberValue) ? value : numberValue,
      };
    }, {});

    return commandMessage;
  }

  static async pass(commandMessage: CommandMessage): Promise<RuleBuilder[]> {
    return commandMessage.rules.reduce((prev, rule) => {
      if (!rule) {
        return prev;
      }

      if (rule.test(commandMessage.content)) {
        return [...prev, rule];
      }

      return prev;
    }, []);
  }
}
