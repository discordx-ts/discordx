import {
  ApplicationCommandMixin,
  Client,
  DefaultPermissionResolver,
  SimpleCommandMessage,
} from "../..";
import { ApplicationCommandPermissionData, Guild, Snowflake } from "discord.js";

export type IDefaultPermission = boolean | DefaultPermissionResolver;

export type IPermissions =
  | ApplicationCommandPermissionData
  | ApplicationCommandPermissionData[]
  | ((
      guild: Guild,
      command: ApplicationCommandMixin | SimpleCommandMessage
    ) =>
      | ApplicationCommandPermissionData
      | ApplicationCommandPermissionData[]
      | Promise<ApplicationCommandPermissionData>
      | Promise<ApplicationCommandPermissionData[]>);

export type IGuild =
  | Snowflake
  | Snowflake[]
  | ((
      client: Client
    ) => Snowflake | Snowflake[] | Promise<Snowflake> | Promise<Snowflake[]>);
