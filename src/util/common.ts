import { ApplicationCommandPermissionData, Guild } from "discord.js";
import { Client, IGuild, IPermissions } from "..";

export const resolveIGuild = async (
  client: Client,
  guilds: IGuild[]
): Promise<string[]> => {
  const guildx = await Promise.all(
    guilds.map((guild) => (typeof guild === "function" ? guild(client) : guild))
  );

  return [...new Set([...guildx.flat(1)])];
};

export const resolveIPermission = async (
  guild: Guild | null,
  permissions: IPermissions[]
): Promise<ApplicationCommandPermissionData[]> => {
  const permissionx = await Promise.all(
    permissions.map((resolver) =>
      typeof resolver === "function" ? resolver(guild) : resolver
    )
  );
  return permissionx.flat(1);
};
