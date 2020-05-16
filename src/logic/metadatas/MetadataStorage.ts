import { Message } from "discord.js";
import { CommandMessage } from "../../types/public/CommandMessage";
import {
  DOn,
  DDiscord,
  DGuard,
  Client,
  DCommand,
  DCommandNotFound,
  ArgsOf,
  DiscordEvents,
  RuleBuilder,
  Modifier,
  DecoratorUtils,
  Rule,
  SimpleArgsRules,
  DIService
} from "../..";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _events: DOn[] = [];
  private _commands: DCommand[] = [];
  private _commandNotFounds: DCommandNotFound[] = [];
  private _guards: DGuard[] = [];
  private _discords: DDiscord[] = [];
  private _modifiers: Modifier<any>[] = [];

  static get instance() {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }

  static clear() {
    this._instance = new MetadataStorage();
  }

  get events() {
    return this._events as readonly DOn[];
  }

  get discords() {
    return this._discords as readonly DDiscord[];
  }

  get commands() {
    return this._commands as readonly DCommand[];
  }

  get commandsNotFound() {
    return this._commandNotFounds as readonly DCommandNotFound[];
  }

  addModifier(modifier: Modifier<any>) {
    this._modifiers.push(modifier);
  }

  addOn(on: DOn) {
    this._events.push(on);
  }

  addCommand(on: DCommand) {
    this._commands.push(on);
    this.addOn(on);
  }

  addCommandNotFound(on: DCommandNotFound) {
    this._commandNotFounds.push(on);
    this.addOn(on);
  }

  addGuard(guard: DGuard) {
    this._guards.push(guard);
    DIService.instance.addService(guard.classRef);
  }

  addDiscord(discord: DDiscord) {
    this._discords.push(discord);
    DIService.instance.addService(discord.classRef);
  }

  async build() {
    // Link the events with their instances
    this._events.map((on) => {
      const discord = this._discords.find((instance) => {
        return instance.classRef === on.classRef;
      });
      on.linkedDiscord = discord;
    });

    await Modifier.applyFromModifierListToList(this._modifiers, this._commands);
    await Modifier.applyFromModifierListToList(this._modifiers, this._commandNotFounds);
    await Modifier.applyFromModifierListToList(this._modifiers, this._discords);

    this._events.map((on) => {
      if (!on.linkedDiscord) {
        console.error(on, "The class isn't decorated by @Discord");
        return;
      }

      on.guards = DecoratorUtils.getLinkedObjects(on, this._guards);
      on.compileGuardFn();
    });
  }

  trigger<Event extends DiscordEvents>(event: Event, client: Client, once: boolean = false) {
    const responses: any[] = [];

    let eventsToExecute = this._events.filter((on) => {
      return on.event === event && on.once === once && !(on instanceof DCommandNotFound);
    });

    return async (...params: ArgsOf<Event>) => {
      let paramsToInject: any = params;
      const isMessage = event === "message";
      let isCommand = false;
      let notFoundOn;

      const onCommands = (await Promise.all(this.events.map(async (on) => {
        if (isMessage && on instanceof DCommand) {
          isCommand = true;
          let pass = false;

          const message = params[0] as Message;
          const commandMessage = CommandMessage.create(message);

          // Flatten all the @Discord rules
          const computedDiscordRules = (await Promise.all(
            on.linkedDiscord.argsRules.map(async (ar) => await ar(commandMessage))
          )).reduce<SimpleArgsRules[]>((prev, cdr) => {
            if (Array.isArray(cdr)) {
              return [
                ...prev,
                ...cdr
              ];
            } else {
              prev.push(cdr);
            }
            return prev;
          }, []).reduce((prev, cor) => {
            return [
              ...prev,
              ...RuleBuilder.fromArray(cor.rules)
            ];
          }, []);

          // Call all the rules callbacks
          const computedOnRules = await Promise.all(
            on.argsRules.map(async (ar) => {
              if (typeof ar === "function") {
                return await ar(commandMessage);
              }
              return ar;
            })
          );

          // Flatten the rules for the methods and merge it to the @Discord rules
          const flatOnRules = computedOnRules.reduce<SimpleArgsRules<RuleBuilder>[]>((prev, cor) => {
            if (Array.isArray(cor)) {
              cor.map((cor) => this.transformRules(computedDiscordRules, cor));
              return [
                ...prev,
                ...(cor as any as SimpleArgsRules<RuleBuilder>[])
              ];
            } else {
              this.transformRules(computedDiscordRules, cor);
              prev.push(cor as any as SimpleArgsRules<RuleBuilder>);
            }
            return prev;
          }, []);

          // Test if the message match any of the rules
          pass = this.matchRules(flatOnRules, message.content);

          if (pass) {
            paramsToInject = message;
            return on;
          } else {
            // If it doesn't pass any of the rules => execute the commandNotFound only on the discord instance that match the message discord rules
            const passNotFound = computedDiscordRules.some((cdr) => {
              return cdr.regex.test(message.content);
            });

            if (passNotFound) {
              notFoundOn = on.linkedDiscord.commandNotFound;
            }
          }
        }
        return undefined;
      }))).filter(c => c);

      if (isCommand) {
        if (onCommands.length > 0) {
          eventsToExecute = onCommands;
        } else if (notFoundOn) {
          eventsToExecute = [notFoundOn];
        } else {
          eventsToExecute = [];
        }
      }

      for (const on of eventsToExecute) {
        const res = await on.getMainFunction<Event>()(paramsToInject, client);
        if (res.executed) {
          responses.push(res.res);
        }
        if (res.on instanceof DCommandNotFound) {
          break;
        }
      }
      return responses;
    };
  }

  private transformRules(toMerge: RuleBuilder[], argsRules: SimpleArgsRules) {
    argsRules.rules = [
      RuleBuilder.join(
        Rule(""),
        RuleBuilder.join(Rule(""), ...toMerge),
        RuleBuilder.join(Rule(argsRules.separator), ...(argsRules.rules as RuleBuilder[]))
      )
    ];
    return argsRules;
  }

  private matchRules(rules: SimpleArgsRules<RuleBuilder>[], text: string) {
    return rules.some((rule) => {
      return rule.rules[0].regex.test(text);
    });
  }
}
