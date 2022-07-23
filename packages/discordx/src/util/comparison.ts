import type {
  ApplicationCommand,
  ApplicationCommandOptionData,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import _ from "lodash";

import type { DApplicationCommand } from "../decorators/index.js";
import type { ApplicationCommandDataEx } from "../types/index.js";

export function isApplicationCommandEqual(
  findCommand: ApplicationCommand,
  DCommand: DApplicationCommand,
  options?: {
    isGuild?: boolean;
    log?: boolean;
  }
): boolean {
  const rawData = DCommand.toJSON();
  const commandJson = findCommand.toJSON() as ApplicationCommandDataEx;

  // weird hacks, required improvements
  commandJson.descriptionLocalizations =
    findCommand.descriptionLocalizations === null
      ? undefined
      : findCommand.descriptionLocalizations;
  commandJson.nameLocalizations =
    findCommand.nameLocalizations === null
      ? undefined
      : findCommand.nameLocalizations;
  // end of weird hacks

  // weird hacks, required improvements
  commandJson.defaultMemberPermissions =
    commandJson.defaultMemberPermissions ?? undefined;
  commandJson.dmPermission = commandJson.dmPermission ?? undefined;

  if (options?.isGuild) {
    commandJson.dmPermission = rawData.dmPermission;
  }

  rawData.defaultMemberPermissions =
    rawData.defaultMemberPermissions ?? commandJson.defaultMemberPermissions;
  rawData.dmPermission = rawData.dmPermission ?? commandJson.dmPermission;
  // end of weird hacks

  // remove nulled localization fields from options
  commandJson.options.forEach((op) => {
    if (op.descriptionLocalizations === null) {
      op.descriptionLocalizations = undefined;
    }
    if (op.nameLocalizations === null) {
      op.nameLocalizations = undefined;
    }
  });

  // Solution for sorting, channel types to ensure equal does not fail
  if (commandJson.type === ApplicationCommandType.ChatInput) {
    commandJson.options?.forEach((op) => {
      if (op.type === ApplicationCommandOptionType.SubcommandGroup) {
        op.options?.forEach((op1) => {
          op1.options?.forEach((op2) => {
            if (op2.type === ApplicationCommandOptionType.Channel) {
              op2.channelTypes?.sort(); // sort mutate array
            }
          });
        });
      }

      if (op.type === ApplicationCommandOptionType.Subcommand) {
        op.options?.forEach((op1) => {
          if (op1.type === ApplicationCommandOptionType.Channel) {
            op1.channelTypes?.sort(); // sort mutate array
          }
        });
      }

      if (op.type === ApplicationCommandOptionType.Channel) {
        op.channelTypes?.sort(); // sort mutate array
      }
    });
  }

  // remove unwanted fields from options
  if (
    commandJson.type === ApplicationCommandType.ChatInput &&
    commandJson.options
  ) {
    commandJson.options = _.map(commandJson.options, (object) =>
      _.omit(object, ["descriptionLocalized", "nameLocalized"])
    ) as ApplicationCommandOptionData[];
  }

  const firstJson = JSON.parse(
    JSON.stringify(
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

  const secondJson = JSON.parse(JSON.stringify(rawData));

  const response = _.isEqual(firstJson, secondJson);

  if (!response && options?.log) {
    console.log("Update required", firstJson, secondJson);
  }

  return response;
}
