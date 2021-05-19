import { DGuard, Client, DDiscord, DIService } from "../..";
import { Decorator } from "./Decorator";

export abstract class Method extends Decorator {
  protected _discord: DDiscord;
  protected _guards: DGuard[] = [];

  get discord() {
    return this._discord;
  }
  set discord(value: DDiscord) {
    this._discord = value;
  }

  get execute() {
    return this.getMainFunction();
  }

  get guards() {
    const clientGuards = Client.guards.map((guard) => DGuard.create(guard.bind(undefined)));
    
    // Returns all the guards of the application
    // The guards that are defined globaly with Client
    // The guards that decorate @Discord
    // The guards that decorate the method (this)
    return [
      ...clientGuards,
      ...this.discord.guards,
      ...this._guards,
      DGuard.create(this._method.bind(this._discord.instance))
    ];
  }
  set guards(value) {
    this._guards = value;
  }

  /**
   * Define how to parse the params
   * @param params The params to parse
   */
  abstract parseParams(...params: any[]);

  /**
   * Execute a guard with params
   */
  getGuardFunction(): (...params: any[]) => Promise<any> {
    const next = async (
      params: any,
      index: number,
      paramsToNext: any
    ) => {
      const nextFn = () => next(params, index + 1, paramsToNext);
      const guardToExecute = this.guards[index];
      let res: any;

      if (index >= this.guards.length - 1) {
        // If it's the main method
        res = await guardToExecute.fn(
          // method([Interaction, Client], ...) => method(Interaction, Client, ...)
          ...this.parseParams(...params as any),
          ...params,
          paramsToNext
        );
      } else {
        // If it's the guards
        // method([Interaction, Client])
        res = await guardToExecute.fn(
          ...params,
          nextFn,
          paramsToNext
        );
      }

      if (res) {
        return res;
      }

      return paramsToNext;
    };

    return (...params: any[]) => next(params, 0, {});
  }

  /**
   * Compiled methods executes all the guards and the main method
   * ```ts
   * compiledMethod = async (params: ArgsOf<any>, client: Client) => {
   *   guard1(params, client)
   *   guard2(params, client)
   *   guard3(params, client)
   *   main(params, client)
   * }
   * ```
   * @returns The function that execute everything
   */
  private getMainFunction() {
    return async (...params: any[]) => {
      return await this.getGuardFunction()(...params);
    };
  }
}