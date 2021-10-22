import * as _ from "lodash";
import {
  ApplicationCommandMixin,
  Client,
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  IGuild,
  IPermissions,
  SimpleCommandMessage,
} from "..";
import { ApplicationCommandPermissionData, Guild } from "discord.js";

export const resolveIGuild = async (
  client: Client,
  command:
    | DApplicationCommand
    | DComponentButton
    | SimpleCommandMessage
    | DComponentSelectMenu
    | undefined,
  guilds: IGuild[]
): Promise<string[]> => {
  const guildx = await Promise.all(
    guilds.map((guild) =>
      typeof guild === "function" ? guild(client, command) : guild
    )
  );

  return _.uniqWith(guildx.flat(1), _.isEqual);
};

export const resolveIPermission = async (
  guild: Guild,
  command: ApplicationCommandMixin | SimpleCommandMessage,
  permissions: IPermissions[]
): Promise<ApplicationCommandPermissionData[]> => {
  const permissionx = await Promise.all(
    permissions.map((resolver) =>
      typeof resolver === "function" ? resolver(guild, command) : resolver
    )
  );

  const uniqFields = ["id", "type"];
  return _.uniqWith(permissionx.flat(1), (a, b) =>
    _.isEqual(_.pick(a, uniqFields), _.pick(b, uniqFields))
  );
};
