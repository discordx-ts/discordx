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
  RuleBuilder
} from "../..";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _events: DOn[] = [];
  private _commands: DCommand[] = [];
  private _commandNotFounds: DCommandNotFound[] = [];
  private _guards: DGuard[] = [];
  private _discords: DDiscord[] = [];

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
    return this._events as ReadonlyArray<DOn>;
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
  }

  addDiscord(discord: DDiscord) {
    this._discords.push(discord);
  }

  build(client: Client) {
    // Link the events with their instances
    this._events.map((on) => {
      const instance = this._discords.find((instance) => {
        return instance.classRef === on.from;
      });
      on.linkedInstance = instance;
    });

    this._events.map((on) => {
      if (!on.linkedInstance) {
        console.log(on, "The class isn't decorated by @Discord");
        return;
      }

      on.guards = this.getGuardsForOn(on);
      on.compileGuardFn(client);
    });
  }

  getGuardsForOn(on: DOn) {
    return this._guards.reverse().filter((guard) => {
      return (
        guard.classRef === on.classRef &&
        guard.method === on.method
      );
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

      const onCommands = this.events.filter((on) => {
        if (isMessage && on instanceof DCommand) {
          isCommand = true;

          const message = params[0] as Message;
          const rules = RuleBuilder.mergeRules(
            on,
            on.linkedInstance
          );

          const pass = RuleBuilder.validate(
            message.content.split(on.argsSeparator.regex),
            rules.argsRules
          );

          if (!pass) {
            notFoundOn = on.linkedInstance.commandNotFound;
          } else {
            paramsToInject = message;
          }

          return pass;
        }
      });

      if (isCommand) {
        if (onCommands.length > 0) {
          eventsToExecute = onCommands;
        } else if (notFoundOn) {
          eventsToExecute = [notFoundOn];
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
}
