/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
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

export interface ISimpleCommandByName {
  command: DSimpleCommand;
  name: string;
}
