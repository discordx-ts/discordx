/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { Client } from "../Client.js";
import type { DOn } from "../decorators/index.js";

export interface EventConfig {
  eventName: string;
  isOnce: boolean;
  isRest: boolean;
}

export interface EventGroup extends EventConfig {
  handlers: DOn[];
}

export class EventManager {
  private groups = new Map<string, EventGroup>();
  private cleanupFunctions: (() => void)[] = [];

  add(event: DOn): void {
    const key = `${event.event}_${String(event.once)}_${String(event.rest)}`;

    if (!this.groups.has(key)) {
      this.groups.set(key, {
        eventName: event.event,
        isOnce: event.once,
        isRest: event.rest,
        handlers: [],
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const group = this.groups.get(key)!;
    group.handlers.push(event);

    // Sort by priority within the group
    group.handlers.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Execute handlers for a specific event group
   */
  private async executeHandlers(
    group: EventGroup,
    client: Client,
    params: any[],
  ): Promise<any[]> {
    const allowedHandlers = group.handlers.filter((handler) =>
      handler.isBotAllowed(client.botId),
    );

    const results: any[] = [];

    await allowedHandlers.reduce(
      (previousPromise, handler) =>
        previousPromise.then(async () => {
          try {
            const result = await handler.execute(client.guards, params, client);
            results.push(result);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            results.push(null);
          }
        }),
      Promise.resolve(),
    );

    return results;
  }

  /**
   * Trigger an event manually (used for testing)
   */
  trigger(
    client: Client,
    { eventName, isOnce, isRest }: EventConfig,
  ): (...params: any[]) => Promise<any[]> {
    const key = `${eventName}_${String(isOnce)}_${String(isRest)}`;
    const group = this.groups.get(key);

    if (!group) {
      // eslint-disable-next-line @typescript-eslint/require-await
      return async () => [];
    }

    return async (...params: any[]) => {
      // Use shared method - collect results for manual triggers
      return this.executeHandlers(group, client, params);
    };
  }

  initEvents(client: Client): void {
    this.groups.forEach((group) => {
      const trigger = (...params: any[]) => {
        void this.executeHandlers(group, client, params);
      };

      const method = group.isOnce ? "once" : "on";

      if (group.isRest) {
        client.rest[method](group.eventName, trigger);
      } else {
        client[method](group.eventName, trigger);
      }

      this.cleanupFunctions.push(() => {
        if (group.isRest) {
          client.rest.off(group.eventName, trigger);
        } else {
          client.off(group.eventName, trigger);
        }
      });
    });
  }

  removeEvents(): void {
    this.cleanupFunctions.forEach((fn) => {
      fn();
    });
    this.cleanupFunctions.length = 0;
  }

  clear(): void {
    this.groups.clear();
    this.cleanupFunctions.length = 0;
  }
}
