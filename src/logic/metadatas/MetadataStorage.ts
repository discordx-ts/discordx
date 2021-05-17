import { Message } from "discord.js";
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
  DIService,
  CommandMessage
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
    // Link the events with @Discord class instances
    this._events = this._events.filter((on) => {
      // Find the linked @Discord of an event
      const discord = this._discords.find((instance) => {
        return instance.from === on.from;
      });

      // You can get the @Discord that wrap a @Command/@On by using 
      // on.linkedDiscord or command.linkedDiscord
      on.linkedDiscord = discord;

      // If the command is imported remove the original one
      // @Discord({ import: [...] })

      return true;
    });

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._commands
    );
    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._commandNotFounds
    );
    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._discords
    );

    this._events.map((on) => {
      on.guards = DecoratorUtils.getLinkedObjects(on, this._guards);
      on.compileGuardFn();
    });
  }

  removeEvent(event: DOn) {
    const command = DecoratorUtils.getLinkedObjects(event, this._commands)[0];
    if (command) {
      this._commands.splice(this._commands.indexOf(command), 1);
    }

    const commandNotFound = DecoratorUtils.getLinkedObjects(
      event,
      this._commandNotFounds
    )[0];
    if (commandNotFound) {
      this._commandNotFounds.splice(
        this._commandNotFounds.indexOf(commandNotFound),
        1
      );
    }

    return event;
  }

  trigger<Event extends DiscordEvents>(
    event: Event,
    client: Client,
    once: boolean = false
  ) {
    const responses: any[] = [];

    let eventsToExecute = this._events.filter((on) => {
      return (
        on.event === event &&
        on.once === once &&
        !(on instanceof DCommandNotFound)
      );
    });

    return async (...params: ArgsOf<Event>) => {
      let paramsToInject: any = params;
      const isMessage = event === "message";
      let isCommand = false;
      let notFoundOn: DCommandNotFound;
      let onCommands: DOn[] = [];

      onCommands = (
        await Promise.all(
          this.events.map(async (on) => {
            if (isMessage && on instanceof DCommand) {
              // If the event type is "message" and if it's decorated by @Command

              const message = params[0] as Message;
              let pass: RuleBuilder[] = undefined;
              isCommand = true;

              // Do not trigger the command if the command was executed by the bot itself
              if (message.author.id === client.user.id) {
                return;
              }
              
              on.rules = [
                ...on.linkedDiscord.rules,
                ...on.rules,
              ];
            
              const commandMessage = CommandMessage.create(message, on);

              const prefixExpr = await on.linkedDiscord.prefix(commandMessage, client);
              const prefix = Rule(prefixExpr);

              // If the message doesn't start with the @Discord prefix, do not continue
              if (!prefix.test(message.content)) {
                return;
              }

              pass = await CommandMessage.pass(client, commandMessage);
              
              if (pass.length > 0) {
                paramsToInject = commandMessage;
                return on;
              } else {
                if (on.linkedDiscord.commandNotFound) {
                  notFoundOn = on.linkedDiscord.commandNotFound;
                }
              }
            } else if (
              on.event === "message" &&
              !(on instanceof DCommandNotFound) &&
              !(on instanceof DCommand)
            ) {
              // If the event type is "message" but not decorated by @Command or @CommandNotFound
              return on;
            }

            // It's not a @Command, returns undefined
            return undefined;
          })
        )
      ).filter((c) => c);

      if (isCommand) {
        const realCommands = onCommands.filter((e) => e instanceof DCommand);
        const onsInCommands = onCommands.filter(
          (e) => !(e instanceof DCommand)
        );

        if (realCommands.length > 0) {
          eventsToExecute = onCommands;
        } else if (notFoundOn && realCommands.length <= 0) {
          eventsToExecute = [...onsInCommands, notFoundOn];
        } else if (onsInCommands.length > 0) {
          eventsToExecute = onsInCommands;
        } else {
          eventsToExecute = [];
        }
      }

      for (const on of eventsToExecute) {
        let injectedParams = paramsToInject;

        if (
          isCommand &&
          !Array.isArray(injectedParams) &&
          !(on instanceof DCommand || on instanceof DCommandNotFound)
        ) {
          injectedParams = [paramsToInject];
        }

        const res = await on.getMainFunction<Event>()(injectedParams, client);

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
}
