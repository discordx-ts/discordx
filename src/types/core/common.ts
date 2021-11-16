import {
  ApplicationCommandMixin,
  Client,
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DefaultPermissionResolver,
  SimpleCommandMessage,
} from "../../index.js";
import {
  ApplicationCommandPermissions,
  Guild,
  Message,
  Snowflake,
} from "discord.js";

export type Awaitable<T> = Promise<T> | T;

export type IPrefixEx = string[];
export type IPrefix =
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
