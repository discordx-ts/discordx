/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Decorator } from "@discordx/internal";

import type { Awaitable, DDiscord, GuardFunction } from "../../index.js";
import { DGuard } from "../../index.js";

/**
 * Base class for method decorators that can be executed with guard middleware.
 *
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
   * Creates an executable function that runs all guards followed by the main method.
   *
   * The execution flow follows this pattern:
   * ```typescript
   * async (params, client) => {
   *   await guard1(params, client, next, sharedData)
   *   await guard2(params, client, next, sharedData)
   *   await guard3(params, client, next, sharedData)
   *   await mainMethod(parsedParams, params, client, sharedData)
   * }
   * ```
   *
   * @returns Function that executes the complete guard chain
   */
  get execute() {
    return (
      guards: GuardFunction[],
      ...params: unknown[]
    ): Promise<unknown> => {
      const globalGuards = guards.map((guard) =>
        DGuard.create(guard.bind(undefined)),
      );
      return this.createGuardChain(globalGuards)(...params);
    };
  }

  /**
   * Gets all guards that will be executed for this method.
   *
   * Combines guards in this order:
   * 1. Global guards from the Discord client
   * 2. Class-level guards from @Discord decorator
   * 3. Method-specific guards from this method
   * 4. The main method itself (as the final "guard")
   */
  get guards(): DGuard[] {
    return [
      ...this.discord.guards,
      ...this._guards,
      DGuard.create(this._methodReference?.bind(this._discord.instance)),
    ];
  }
  set guards(value: DGuard[]) {
    this._guards = value;
  }

  /**
   * Parses the raw execution parameters into the format expected by the method.
   * Must be implemented by subclasses to handle their specific parameter types.
   *
   * @param params - Raw execution parameters (e.g., Discord interaction, client)
   * @returns Parsed parameters ready for method execution
   */
  abstract parseParams(...params: unknown[]): Awaitable<unknown[]>;

  /**
   * Creates a guard execution chain that processes guards sequentially.
   *
   * Each guard receives:
   * - Original parameters (interaction, client, etc.)
   * - Next function to continue the chain
   * - Shared data object for passing data between guards
   *
   * The final method receives:
   * - Parsed parameters (command options, etc.)
   * - Original parameters (interaction, client, etc.)
   * - Shared data object
   *
   * @param globalGuards - Guards to prepend to the execution chain
   * @returns Function that executes the complete guard chain
   */
  private createGuardChain(
    globalGuards: DGuard[],
  ): (...params: unknown[]) => Promise<unknown> {
    const allGuards = [...globalGuards, ...this.guards];

    const executeNext = async (
      params: unknown[],
      index: number,
      sharedData: Record<string, unknown>,
    ): Promise<unknown> => {
      const currentGuard = allGuards[index];
      const isLastGuard = index >= allGuards.length - 1;

      let result: unknown;

      if (isLastGuard) {
        // Execute the main method with parsed parameters
        const parsedParams = await this.parseParams(...params);
        const allArgs: any = [...parsedParams, ...params, sharedData];
        result = await currentGuard?.fn.apply(null, allArgs);
      } else {
        // Execute guard middleware with next function
        const nextFn = () => executeNext(params, index + 1, sharedData);
        const allArgs: any = [...params, nextFn, sharedData];
        result = await currentGuard?.fn.apply(null, allArgs);
      }

      return result ?? sharedData;
    };

    return (...params: unknown[]) => executeNext(params, 0, {});
  }
}
