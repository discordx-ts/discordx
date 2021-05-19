import { Decorator } from "./Decorator";
import {
  DiscordEvents,
  DDiscord,
  DGuard,
  ArgsOf,
  Client,
  GuardFunction,
  MainMethod,
  DIService
} from "../..";

export class DOn extends Decorator {
  protected _event: DiscordEvents;
  protected _mainFunction?: MainMethod<any>;
  protected _discord: DDiscord;
  protected _once: boolean;
  protected _guardsFunction?: (...params: any[]) => Promise<any>;
  protected _originalParams: Partial<DOn>;
  protected _compiledGuards: GuardFunction[] = [];
  protected _guards: DGuard[] = [];
  protected _hidden: boolean = false;

  get discord() {
    return this._discord;
  }
  set discord(value: DDiscord) {
    this._discord = value;
  }

  get event() {
    return this._event;
  }
  set event(value: DiscordEvents) {
    this._event = value;
  }

  get hidden() {
    return this._hidden;
  }
  set hidden(value) {
    this._hidden = value;
  }

  get once() {
    return this._once;
  }
  set once(value: boolean) {
    this._once = value;
  }

  set guards(value: DGuard[]) {
    this._guards = [...Client.guards, ...this.discord.guards, ...value];
    this.extractGuards();
  }

  protected constructor() {
    super();
  }

  static create(event: DiscordEvents, once: boolean) {
    const on = new DOn();

    on._event = event;
    on._once = once;

    return on;
  }

  bind() {
    this._method.bind(this._discord.instance);
  }

  getMainFunction<Event extends DiscordEvents = any>(): MainMethod<Event> {
    if (!this._mainFunction) {
      this.compileMainFunction();
    }
    return this._mainFunction;
  }

  // TOTEST: next function & next function params
  compileGuardFn() {
    const next = async (
      params: any,
      client: Client,
      index: number,
      paramsToNext: any
    ) => {
      const nextFn = () => next(params, client, index + 1, paramsToNext);
      const guardToExecute = this._compiledGuards[index];
      let res: any;

      if (index >= this._compiledGuards.length - 1) {
        res = await guardToExecute(params, client, paramsToNext);
      } else {
        // If it's a commmand, the params isn't a array, and the destructing with guard causes an error
        const normalizedParams = Array.isArray(params) ? params : [params];
        res = await guardToExecute(
          normalizedParams,
          client,
          nextFn,
          paramsToNext
        );
      }

      if (res) {
        return res;
      }
      return paramsToNext;
    };

    this._guardsFunction = (params: any, client: Client) =>
      next(params, client, 0, {});
  }

  /**
   * Bind the guards to the class instance created on DI
   */
  private extractGuards() {
    this._guards.map((guard) => {
      this._compiledGuards.push(
        guard.fn.bind(DIService.instance.getService(guard.classRef))
      );
    });
    this._compiledGuards.push(
      this.method.bind(DIService.instance.getService(this.classRef))
    );
  }

  private compileMainFunction<
    Event extends DiscordEvents = any
  >(): MainMethod<Event> {
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
        executed: true,
      };
    };

    return this._mainFunction;
  }
}
