import { ApplicationCommandPermissionData, Guild } from "discord.js";

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
