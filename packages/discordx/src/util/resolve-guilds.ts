import isEqual from "lodash/isEqual.js";
import uniqWith from "lodash/uniqWith.js";

import type {
  Client,
  DApplicationCommand,
  DComponent,
  DReaction,
  IGuild,
  SimpleCommandMessage,
} from "../index.js";

/**
 * Resolve IGuilds
 * @param client
 * @param command
 * @param guilds
 * @returns
 */
export const resolveIGuilds = async (
  client: Client,
  command:
    | DApplicationCommand
    | DComponent
    | DReaction
    | SimpleCommandMessage
    | undefined,
  guilds: IGuild[],
): Promise<string[]> => {
  const guildX = await Promise.all(
    guilds.map((guild) =>
      typeof guild === "function" ? guild(client, command) : guild,
    ),
  );

  return uniqWith(guildX.flat(1), isEqual);
};
