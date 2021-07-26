import { DGuard, Client, DDiscord } from "../..";
import { Decorator } from "./Decorator";

export abstract class Method extends Decorator {
  protected _discord!: DDiscord;
  protected _guards: DGuard[] = [];

  get discord() {
    return this._discord;
  }
  set discord(value: DDiscord) {
    this._discord = value;
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
  get execute() {
    return async (...params: any[]) => {
      return await this.getGuardFunction()(...params);
    };
  }

  /**
   * Returns all the guards of the application
   * The guards that are defined globaly with Client
   * The guards that decorate @Discord
   * The guards that decorate the method (this)
   */
  get guards() {
    const clientGuards = Client.guards.map((guard) =>
      DGuard.create(guard.bind(undefined))
    );

    return [
      ...clientGuards,
      ...this.discord.guards,
      ...this._guards,
      DGuard.create(this._method.bind(this._discord.instance)),
    ];
  }
  set guards(value) {
    this._guards = value;
  }

  /**
   * Define how to parse the params
   * @param params The params to parse
   */
  abstract parseParams(...params: any[]): any[];

  /**
   * Execute a guard with params
   */
  getGuardFunction(): (...params: any[]) => Promise<any> {
    const next = async (params: any, index: number, paramsToNext: any) => {
      const nextFn = () => next(params, index + 1, paramsToNext);
      const guardToExecute = this.guards[index];
      let res: any;

      if (index >= this.guards.length - 1) {
        // If it's the main method
        res = await (guardToExecute.fn as any)(
          // method(...ParsedOptions, [Interaction, Client], ...) => method(...ParsedOptions, Interaction, Client, ...)
          ...this.parseParams(...params),
          ...params,
          paramsToNext
        );
      } else {
        // If it's the guards
        // method([Interaction, Client])
        res = await (guardToExecute.fn as any)(...params, nextFn, paramsToNext);
      }

      if (res) {
        return res;
      }

      return paramsToNext;
    };

    return (...params: any[]) => next(params, 0, {});
  }
}
