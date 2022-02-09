import type {
  ApplicationCommandPermissions,
  Guild,
  Message,
  Snowflake,
} from "discord.js";

import type {
  ApplicationCommandMixin,
  Client,
  DApplicationCommand,
  DComponent,
  DefaultPermissionResolver,
  DSimpleCommand,
  SimpleCommandMessage,
} from "../../index.js";

export type Awaitable<T> = Promise<T> | T;

export type IPrefix = string | string[];
export type IPrefixResolver =
  | string
  | string[]
  | ((message: Message) => Awaitable<string | string[]>);

export type IDefaultPermission = boolean | DefaultPermissionResolver;

export type IPermissions =
  | ApplicationCommandPermissions
  | ApplicationCommandPermissions[]
  | ((
      guild: Guild,
      command: ApplicationCommandMixin | SimpleCommandMessage
    ) =>
      | ApplicationCommandPermissions
      | ApplicationCommandPermissions[]
      | Promise<ApplicationCommandPermissions>
      | Promise<ApplicationCommandPermissions[]>);

export type IGuild =
  | Snowflake
  | Snowflake[]
  | ((
      client: Client,
      command:
        | DApplicationCommand
        | DComponent
        | SimpleCommandMessage
        | undefined
    ) => Snowflake | Snowflake[] | Promise<Snowflake> | Promise<Snowflake[]>);

export type ISimpleCommandByName = { command: DSimpleCommand; name: string };
