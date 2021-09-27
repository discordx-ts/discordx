import * as _ from "lodash";
import { ApplicationCommandPermissionData, Guild } from "discord.js";
import { Client, IGuild, IPermissions } from "..";

export const resolveIGuild = async (
  client: Client,
  guilds: IGuild[]
): Promise<string[]> => {
  const guildx = await Promise.all(
    guilds.map((guild) => (typeof guild === "function" ? guild(client) : guild))
  );

  return _.uniqWith(guildx.flat(1), _.isEqual);
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

  const uniqFields = ["id", "type"];
  return _.uniqWith(permissionx.flat(1), (a, b) =>
    _.isEqual(_.pick(a, uniqFields), _.pick(b, uniqFields))
  );
};
