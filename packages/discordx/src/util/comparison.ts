/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApplicationCommand } from "discord.js";
import _ from "lodash";

import type { DApplicationCommand } from "../decorators/index.js";
import type { ApplicationCommandDataEx } from "../types/index.js";

function jsonToString(obj: unknown): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

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

export function isApplicationCommandEqual(
  findCommand: ApplicationCommand,
  DCommand: DApplicationCommand,
  options?: {
    isGuild?: boolean;
    log?: boolean;
  }
): boolean {
  const commandJson = findCommand.toJSON() as ApplicationCommandDataEx;
  const rawData = DCommand.toJSON();

  // replace null fields with undefined
  RecursivelyMatchField(
    commandJson,
    [
      "descriptionLocalizations",
      "nameLocalizations",
      "descriptionLocalized",
      "nameLocalized",
      "dmPermission",
      "defaultMemberPermissions",
    ],
    (object: any, key: string) => {
      if (object[key] === null) {
        object[key] = undefined;
      }
    }
  );

  // remove unwanted fields
  if (options?.isGuild) {
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
      _.omit(
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

  const response = _.isEqual(firstJson, secondJson);

  if (!response && options?.log) {
    console.log("Update required", firstJson, secondJson);
  }

  return response;
}
