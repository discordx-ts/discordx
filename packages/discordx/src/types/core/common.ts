/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  ChatInputCommandInteraction,
  Message,
  Snowflake,
} from "discord.js";

import type {
  Client,
  DApplicationCommand,
  DComponent,
  DReaction,
  DSimpleCommand,
  GuardFunction,
  SimpleCommandMessage,
} from "../../index.js";

export type Awaitable<T> = Promise<T> | T;

export type TransformerFunction = (
  value: any,
  interaction: ChatInputCommandInteraction,
) => Awaitable<any>;

export type Next = (...paramsToNext: unknown[]) => Promise<unknown>;

export type IPrefix = string | string[];
export type IPrefixResolver =
  | string
  | string[]
  | ((message: Message) => Awaitable<string | string[]>);

export type IGuild =
  | Snowflake
  | Snowflake[]
  | ((
      client: Client,
      command:
        | DApplicationCommand
        | DComponent
        | DReaction
        | SimpleCommandMessage
        | undefined,
    ) => Snowflake | Snowflake[] | Promise<Snowflake> | Promise<Snowflake[]>);

export type ISimpleCommandByName = { command: DSimpleCommand; name: string };

export type ITriggerEventData = {
  client: Client;
  event: string;
  guards: GuardFunction[];
  once: boolean;
  rest: boolean;
};

export interface EventListenerDetail {
  once: boolean;
  rest: boolean;
  trigger: (...params: any[]) => Promise<any>;
}
