/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import {
  ApplicationCommandType,
  type ApplicationCommand,
  type ApplicationCommandData,
  type Collection,
  type Snowflake,
} from "discord.js";

import {
  ApplicationCommandMixin,
  isApplicationCommandEqual,
  resolveIGuilds,
  type ApplicationCommandDataEx,
  type Client,
  type DApplicationCommand,
} from "../../index.js";

export class ApplicationCommandManager {
  constructor(private client: Client) {}

  async initApplicationCommands(retainDeleted = false): Promise<void> {
    const guildCommandStore = await this.getCommandsByGuild();

    const guildPromises = Array.from(guildCommandStore.entries()).map(
      ([guildId, commands]) => {
        const guild = this.client.guilds.cache.get(guildId);
        return guild
          ? this.initGuildApplicationCommands(guildId, commands, retainDeleted)
          : Promise.resolve();
      },
    );

    await Promise.all([
      Promise.all(guildPromises),
      this.initGlobalApplicationCommands(retainDeleted),
    ]);
  }

  async clearApplicationCommands(...guilds: Snowflake[]): Promise<void> {
    if (guilds.length) {
      await Promise.all(
        guilds.map(async (guildId) =>
          this.client.guilds.cache.get(guildId)?.commands.set([]),
        ),
      );
    } else {
      await this.client.application?.commands.set([]);
    }
  }

  private async getCommandsByGuild(): Promise<
    Map<string, DApplicationCommand[]>
  > {
    const botResolvedGuilds = await this.client.botResolvedGuilds;
    const guildCommandStore = new Map<Snowflake, DApplicationCommand[]>();

    const allGuildCommands = this.client.applicationCommands.filter(
      (command) => {
        const guilds = [...botResolvedGuilds, ...command.guilds];
        return command.isBotAllowed(this.client.botId) && guilds.length;
      },
    );

    await Promise.all(
      allGuildCommands.map(async (command) => {
        const guilds = await resolveIGuilds(this.client, command, [
          ...botResolvedGuilds,
          ...command.guilds,
        ]);

        guilds.forEach((guildId) => {
          const commands = guildCommandStore.get(guildId) ?? [];
          guildCommandStore.set(guildId, [...commands, command]);
        });
      }),
    );

    return guildCommandStore;
  }

  private async initGuildApplicationCommands(
    guildId: string,
    commands: DApplicationCommand[],
    retainDeleted: boolean,
  ): Promise<void> {
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      this.client.logger.warn(
        `${this.client.user?.username ?? this.client.botId} >> initGuildApplicationCommands: skipped (guild ${guildId} unavailable)`,
      );
      return;
    }

    const discordCommands = await guild.commands.fetch({
      withLocalizations: true,
    });
    const botResolvedGuilds = await this.client.botResolvedGuilds;

    const {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
    } = await this.categorizeGuildCommands(
      commands,
      discordCommands,
      botResolvedGuilds,
    );

    this.logCommandChanges(guild.toString(), {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted,
    });

    const bulkUpdate = this.prepareBulkUpdate({
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted,
    });

    if (bulkUpdate.length > 0) {
      await guild.commands.set(bulkUpdate as ApplicationCommandData[]);
    }
  }

  private async initGlobalApplicationCommands(
    retainDeleted: boolean,
  ): Promise<void> {
    if (!this.client.application) {
      throw new Error(
        "Client not ready, connect to Discord before fetching commands",
      );
    }

    const botResolvedGuilds = await this.client.botResolvedGuilds;
    const allDiscordCommands = await this.client.application.commands.fetch();

    const discordCommands = allDiscordCommands.filter(
      (cmd) =>
        !cmd.guild && cmd.type !== ApplicationCommandType.PrimaryEntryPoint,
    );

    const globalCommands = this.client.applicationCommands.filter((command) => {
      if (botResolvedGuilds.length || command.guilds.length) return false;
      if (command.botIds.length && !command.botIds.includes(this.client.botId))
        return false;
      return true;
    });

    const {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
    } = this.categorizeGlobalCommands(globalCommands, discordCommands);

    this.logCommandChanges("global", {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted,
    });

    const bulkUpdate = this.prepareBulkUpdate({
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted,
    });

    if (bulkUpdate.length > 0) {
      await this.client.application.commands.set(
        bulkUpdate as ApplicationCommandData[],
      );
    }
  }

  private async categorizeGuildCommands(
    commands: DApplicationCommand[],
    discordCommands: Collection<string, ApplicationCommand>,
    botResolvedGuilds: string[],
  ) {
    const commandsToAdd = commands.filter((command) => {
      const match = (cmd: ApplicationCommand) =>
        cmd.name === command.name && cmd.type === command.type;
      return !discordCommands.find(match);
    });

    const commandsToUpdate: ApplicationCommandMixin[] = [];
    const commandsToSkip: ApplicationCommandMixin[] = [];

    commands.forEach((command) => {
      const match = (cmd: ApplicationCommand) =>
        cmd.name === command.name && cmd.type === command.type;

      const findCommand = discordCommands.find(match);
      if (!findCommand) return;

      const mixinCommand = new ApplicationCommandMixin(findCommand, command);

      if (!isApplicationCommandEqual(findCommand, command, true)) {
        commandsToUpdate.push(mixinCommand);
      } else {
        commandsToSkip.push(mixinCommand);
      }
    });

    const commandsToDelete: ApplicationCommand[] = [];
    await Promise.all(
      discordCommands.map(async (cmd: ApplicationCommand) => {
        const match = (command: DApplicationCommand) =>
          cmd.name === command.name && cmd.type === command.type;

        const commandFind = commands.find(match);
        if (!commandFind) {
          commandsToDelete.push(cmd);
          return;
        }

        const guilds = await resolveIGuilds(this.client, commandFind, [
          ...botResolvedGuilds,
          ...commandFind.guilds,
        ]);

        if (!cmd.guildId || !guilds.includes(cmd.guildId)) {
          commandsToDelete.push(cmd);
        }
      }),
    );

    return {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
    };
  }

  private categorizeGlobalCommands(
    commands: DApplicationCommand[],
    discordCommands: Collection<string, ApplicationCommand>,
  ) {
    const commandsToAdd = commands.filter((command) => {
      const match = (cmd: ApplicationCommand) =>
        cmd.name === command.name && cmd.type === command.type;
      return !discordCommands.find(match);
    });

    const commandsToUpdate: ApplicationCommandMixin[] = [];
    const commandsToSkip: ApplicationCommandMixin[] = [];

    commands.forEach((command) => {
      const match = (cmd: ApplicationCommand) =>
        cmd.name === command.name && cmd.type === command.type;

      const discordCommand = discordCommands.find(match);
      if (!discordCommand) return;

      const mixinCommand = new ApplicationCommandMixin(discordCommand, command);

      if (!isApplicationCommandEqual(discordCommand, command)) {
        commandsToUpdate.push(mixinCommand);
      } else {
        commandsToSkip.push(mixinCommand);
      }
    });

    const commandsToDelete = discordCommands
      .filter((cmd: ApplicationCommand) => {
        const match = (command: DApplicationCommand) =>
          command.name !== cmd.name || command.type !== cmd.type;
        return commands.every(match);
      })
      .toJSON();

    return {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
    };
  }

  private logCommandChanges(
    target: string,
    changes: {
      commandsToAdd: DApplicationCommand[];
      commandsToUpdate: ApplicationCommandMixin[];
      commandsToSkip: ApplicationCommandMixin[];
      commandsToDelete: ApplicationCommand[];
      retainDeleted: boolean;
    },
  ): void {
    if (this.client.silent) return;

    const {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted,
    } = changes;

    let str = `${this.client.user?.username ?? this.client.botId} >> commands >> ${target}`;

    const addNames = commandsToAdd.map((cmd) => cmd.name).join(", ");
    const deleteNames = commandsToDelete.map((cmd) => cmd.name).join(", ");
    const skipNames = commandsToSkip.map((cmd) => cmd.name).join(", ");
    const updateNames = commandsToUpdate.map((cmd) => cmd.name).join(", ");

    const deleteOrRetain = retainDeleted ? "retaining" : "deleting";
    str += `\n\t>> adding   ${commandsToAdd.length.toString()} [${addNames}]`;
    str += `\n\t>> ${deleteOrRetain}   ${commandsToDelete.length.toString()} [${deleteNames}]`;
    str += `\n\t>> skipping   ${commandsToSkip.length.toString()} [${skipNames}]`;
    str += `\n\t>> updating   ${commandsToUpdate.length.toString()} [${updateNames}]\n`;

    this.client.logger.log(str);
  }

  private prepareBulkUpdate(data: {
    commandsToAdd: DApplicationCommand[];
    commandsToUpdate: ApplicationCommandMixin[];
    commandsToSkip: ApplicationCommandMixin[];
    commandsToDelete: ApplicationCommand[];
    retainDeleted: boolean;
  }): ApplicationCommandDataEx[] {
    const {
      commandsToAdd,
      commandsToUpdate,
      commandsToSkip,
      commandsToDelete,
      retainDeleted,
    } = data;

    const bulkUpdate: ApplicationCommandDataEx[] = [];

    commandsToSkip.forEach((cmd) => bulkUpdate.push(cmd.instance.toJSON()));
    commandsToAdd.forEach((cmd) => bulkUpdate.push(cmd.toJSON()));
    commandsToUpdate.forEach((cmd) => bulkUpdate.push(cmd.instance.toJSON()));

    if (retainDeleted) {
      commandsToDelete.forEach((cmd) => {
        bulkUpdate.push(cmd.toJSON() as ApplicationCommandDataEx);
      });
    }

    return bulkUpdate;
  }
}
