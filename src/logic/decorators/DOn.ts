import { Message } from "discord.js";
import { Decorator } from "./Decorator";
import {
  DiscordEvents,
  DDiscord,
  DGuard,
  DCommand,
  ArgsOf,
  Next,
  Client,
  GuardFunction,
  DCommandNotFound,
  MainMethod,
  RuleBuilder
} from "../..";


export class DOn extends Decorator {
  protected _event: DiscordEvents;
  protected _mainFunction?: MainMethod<any>;
  protected _linkedInstance?: DDiscord;
  protected _once: boolean;
  protected _guardsFunction?: (...params: any[]) => Promise<any>;
  protected _originalParams: Partial<DOn>;
  protected _compiledGuards: GuardFunction[] = [];
  protected _guards: DGuard[] = [];

  get linkedInstance() {
    return this._linkedInstance;
  }
  set linkedInstance(value: DDiscord) {
    if (value) {
      this._linkedInstance = value;
      if (this instanceof DCommandNotFound) {
        this._linkedInstance.commandNotFound = this;
      }
    }
  }

  get event() {
    return this._event;
  }
  set event(value: DiscordEvents) {
    this._event = value;
  }

  get once() {
    return this._once;
  }
  set once(value: boolean) {
    this._once = value;
  }

  set guards(value: DGuard[]) {
    this._guards = value;
    this.extractGuards();
  }

  static createOn(
    event: DiscordEvents,
    once: boolean
  ) {
    const on = new DOn();

    on._event = event;
    on._once = once;

    return on;
  }

  bind() {
    this._method.bind(this._linkedInstance.instance);
  }

  getMainFunction<Event extends DiscordEvents = any>(): MainMethod<Event> {
    if (!this._mainFunction) {
      this.compileMainFunction();
    }
    return this._mainFunction;
  }

  // TOTEST: next function & next function params
  compileGuardFn() {
    const next = async (params: any, client: Client, index: number, paramsToNext: any) => {
      const nextFn = () => next(params, client, index + 1, paramsToNext);
      const guardToExecute = this._compiledGuards[index];
      let res: any;

      if (index >= this._compiledGuards.length - 1) {
        res = await guardToExecute(params, client, this, paramsToNext);
      } else {
        res = await guardToExecute(params, client, this, nextFn, paramsToNext);
      }

      if (res) {
        return res;
      }
      return paramsToNext;
    };

    this._guardsFunction = (params: any, client: Client) => next(params, client, 0, {});
  }

  // TOTEST: guard class binding
  private extractGuards() {
    this._guards.map((guard) => {
      this._compiledGuards.push(guard.fn);
    });
    this._compiledGuards.push(this.method.bind(this._linkedInstance.instance));
  }

  private compileMainFunction<Event extends DiscordEvents = any>(): MainMethod<Event> {
    // Compiled mthods executes all the guards and the main method
    // compiledMethod = async (params: ArgsOf<any>, client: Client) => {
    //   guard1(params, client)
    //   guard2(params, client)
    //   guard3(params, client)
    //   main(params, client)
    // }

    this._mainFunction = async (params: ArgsOf<Event>, client: Client) => {
      const res = await this._guardsFunction(params, client);
      return {
        res,
        on: this,
        executed: true
      };
    };

    return this._mainFunction;
  }
}
