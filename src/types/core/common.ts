import { ApplicationCommandPermissionData, Guild, Snowflake } from "discord.js";
import { Client, DefaultPermissionResolver } from "../..";

export type IDefaultPermission = boolean | DefaultPermissionResolver;

export type IPermissions =
  | ApplicationCommandPermissionData
  | ApplicationCommandPermissionData[]
  | ((
      guild: Guild
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
