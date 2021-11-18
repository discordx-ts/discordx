import {
  ApplicationCommandMixin,
  Client,
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DSimpleCommand,
  DefaultPermissionResolver,
  SimpleCommandMessage,
} from "../../index.mjs";
import {
  ApplicationCommandPermissions,
  Guild,
  Message,
  Snowflake,
} from "discord.js";

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
        | DComponentButton
        | SimpleCommandMessage
        | DComponentSelectMenu
        | undefined
    ) => Snowflake | Snowflake[] | Promise<Snowflake> | Promise<Snowflake[]>);

export type ISimpleCommandByName = { command: DSimpleCommand; name: string };
