import { ApplicationCommandPermissionData, Guild, Snowflake } from "discord.js";
import { Client } from "../..";

export type IPermissions =
  | ApplicationCommandPermissionData
  | ApplicationCommandPermissionData[]
  | ((
      guild: Guild | null
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
