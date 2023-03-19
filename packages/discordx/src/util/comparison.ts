import type { ApplicationCommand } from "discord.js";
import isEqual from "lodash/isEqual.js";
import omit from "lodash/omit.js";

import type { DApplicationCommand } from "../decorators/index.js";
import type { ApplicationCommandDataEx } from "../types/index.js";

/**
 * Transform bigint to string
 * @param obj - object
 * @returns
 */
function jsonToString(obj: unknown): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

/**
 * Recursively match field
 *
 * @param object
 * @param keys
 * @param onMatch
 */
export function RecursivelyMatchField(
  object: Record<string, any>,
  keys: string[],
  onMatch: (object: any, key: string) => void
): void {
  Object.keys(object).some(function (k) {
    if (keys.includes(k)) {
      onMatch(object, k);
    }

    if (object[k] && typeof object[k] === "object") {
      RecursivelyMatchField(object[k], keys, onMatch);
    }
  });
}

/**
 * Check if ApplicationCommand and DApplicationCommand has same properties
 *
 * @param findCommand
 * @param DCommand
 * @param isGuild
 * @returns
 */
export function isApplicationCommandEqual(
  findCommand: ApplicationCommand,
  DCommand: DApplicationCommand,
  isGuild?: true
): boolean {
  const commandJson = findCommand.toJSON() as ApplicationCommandDataEx;
  const rawData = DCommand.toJSON();

  // replace undefined fields with null
  RecursivelyMatchField(
    commandJson,
    ["descriptionLocalizations", "nameLocalizations"],
    (object: any, key: string) => {
      if (object[key] === undefined) {
        object[key] = null;
      }
    }
  );

  // replace null fields with undefined
  RecursivelyMatchField(
    commandJson,
    ["descriptionLocalized", "nameLocalized", "dmPermission"],
    (object: any, key: string) => {
      if (object[key] === null) {
        object[key] = undefined;
      }
    }
  );

  // remove unwanted fields
  if (isGuild) {
    RecursivelyMatchField(
      rawData,
      ["dmPermission"],
      (object: any, key: string) => {
        object[key] = undefined;
      }
    );
  }

  const firstJson = JSON.parse(
    jsonToString(
      omit(
        commandJson,
        "id",
        "applicationId",
        "guild",
        "guildId",
        "version",
        "descriptionLocalized",
        "nameLocalized",
        "permissions",
        "defaultPermission"
      )
    )
  );

  const secondJson = JSON.parse(jsonToString(rawData));

  const response = isEqual(firstJson, secondJson);

  return response;
}
