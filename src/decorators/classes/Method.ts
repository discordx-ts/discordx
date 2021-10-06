import { DDiscord, DGuard, GuardFunction } from "../..";
import { Decorator } from "./Decorator";

/**
 * @category Decorator
 */
export abstract class Method extends Decorator {
  protected _discord!: DDiscord;
  protected _guards: DGuard[] = [];

  get discord(): DDiscord {
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
   * @returns
   */
  get execute() {
    return (
      guards: GuardFunction[],
      ...params: unknown[]
    ): Promise<unknown> => {
      const globalGuards = guards.map((guard) =>
        DGuard.create(guard.bind(undefined))
      );
      return this.getGuardFunction(globalGuards)(...params);
    };
  }

  /**
   * Returns all the guards of the application
   * The guards that are defined globally with Client
   * The guards that decorate @Discord
   * The guards that decorate the method (this)
   */
  get guards(): DGuard[] {
    return [
      ...this.discord.guards,
      ...this._guards,
      DGuard.create(this._method?.bind(this._discord.instance)),
    ];
  }
  set guards(value: DGuard[]) {
    this._guards = value;
  }

  /**
   * Define how to parse the params
   * @param params The params to parse
   */
  abstract parseParams(...params: unknown[]): unknown[];

  /**
   * Execute a guard with params
   */
  getGuardFunction(
    globalGuards: DGuard[]
  ): (...params: unknown[]) => Promise<unknown> {
    const next = async (
      params: [],
      index: number,
      paramsToNext: Record<string, unknown>
    ) => {
      const nextFn = () => next(params, index + 1, paramsToNext);
      const guardToExecute = [...globalGuards, ...this.guards][index];
      let res: unknown;

      if (index >= [...globalGuards, ...this.guards].length - 1) {
        // If it's the main method
        res = await (guardToExecute?.fn as (...[]) => unknown)(
          // method(...ParsedOptions, [Interaction, Client], ...) => method(...ParsedOptions, Interaction, Client, ...)
          ...this.parseParams(...params),
          ...params,
          paramsToNext
        );
      } else {
        // If it's the guards
        // method([Interaction, Client])
        res = await (guardToExecute?.fn as (...[]) => unknown)(
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

    return (...params: []) => next(params, 0, {});
  }
}
