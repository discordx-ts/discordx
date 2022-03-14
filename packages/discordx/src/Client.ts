import { DIService } from "@discordx/di";
import type {
  ApplicationCommand,
  ApplicationCommandData,
  AutocompleteInteraction,
  ButtonInteraction,
  Collection,
  CommandInteraction,
  CommandInteractionOption,
  ContextMenuInteraction,
  DiscordAPIError,
  Interaction,
  Message,
  SelectMenuInteraction,
  Snowflake,
} from "discord.js";
import { Client as ClientJS } from "discord.js";
import _ from "lodash";

import type {
  ClientOptions,
  DApplicationCommand,
  DApplicationCommandGroup,
  DApplicationCommandOption,
  DComponent,
  DDiscord,
  DiscordEvents,
  DOn,
  DSimpleCommand,
  DSimpleCommandOption,
  GuardFunction,
  IGuild,
  ILogger,
  InitCommandOptions,
  IPrefix,
  IPrefixResolver,
  ISimpleCommandByName,
  SimpleCommandConfig,
} from "./index.js";
import {
  ApplicationCommandMixin,
  ApplicationGuildMixin,
  MetadataStorage,
  resolveIGuilds,
  SimpleCommandMessage,
  SimpleCommandOptionType,
  SimpleCommandParseType,
} from "./index.js";

/**
 * Extend original client class of discord.js
 *
 * @param options - Client options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/general/client)
 */
export class Client extends ClientJS {
  private _botId: string;
  private _isBuilt = false;
  private _prefix: IPrefixResolver;
  private _simpleCommandConfig?: SimpleCommandConfig;
  private _silent: boolean;
  private _botGuilds: IGuild[] = [];
  private _guards: GuardFunction[] = [];
  private logger: ILogger;

  // static getters

  static get applicationCommandSlashesFlat(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommandSlashesFlat;
  }

  static get applicationCommandSlashes(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommandSlashes;
  }

  static get applicationCommandUsers(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommandUsers;
  }

  static get applicationCommandMessages(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommandMessages;
  }

  static get applicationCommandSlashOptions(): readonly DApplicationCommandOption[] {
    return MetadataStorage.instance.applicationCommandSlashOptions;
  }

  static get applicationCommands(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommands;
  }

  static get applicationCommandSlashGroups(): readonly DApplicationCommandGroup[] {
    return MetadataStorage.instance.applicationCommandSlashGroups;
  }

  static get applicationCommandSlashSubGroups(): readonly DApplicationCommandGroup[] {
    return MetadataStorage.instance.applicationCommandSlashSubGroups;
  }

  static get simpleCommandsByName(): readonly ISimpleCommandByName[] {
    return MetadataStorage.instance.simpleCommandsByName;
  }

  static get simpleCommandsByPrefix(): Map<string, ISimpleCommandByName[]> {
    return MetadataStorage.instance.simpleCommandsByPrefix;
  }

  static get simpleCommands(): readonly DSimpleCommand[] {
    return MetadataStorage.instance.simpleCommands;
  }

  static get selectMenuComponents(): readonly DComponent[] {
    return MetadataStorage.instance.selectMenuComponents;
  }

  static get buttonComponents(): readonly DComponent[] {
    return MetadataStorage.instance.buttonComponents;
  }

  static get events(): readonly DOn[] {
    return MetadataStorage.instance.events;
  }

  static get discords(): readonly DDiscord[] {
    return MetadataStorage.instance.discords;
  }

  static get instance(): MetadataStorage {
    return MetadataStorage.instance;
  }

  // map static getters

  get applicationCommandSlashes(): readonly DApplicationCommand[] {
    return Client.applicationCommandSlashes;
  }

  get applicationCommandSlashesFlat(): readonly DApplicationCommand[] {
    return Client.applicationCommandSlashesFlat;
  }

  get applicationCommandSlashOptions(): readonly DApplicationCommandOption[] {
    return Client.applicationCommandSlashOptions;
  }

  get applicationCommandSlashGroups(): readonly DApplicationCommandGroup[] {
    return Client.applicationCommandSlashGroups;
  }

  get applicationCommandSlashSubGroups(): readonly DApplicationCommandGroup[] {
    return Client.applicationCommandSlashSubGroups;
  }

  get applicationCommandUsers(): readonly DApplicationCommand[] {
    return Client.applicationCommandUsers;
  }

  get applicationCommandMessages(): readonly DApplicationCommand[] {
    return Client.applicationCommandMessages;
  }

  get applicationCommands(): readonly DApplicationCommand[] {
    return Client.applicationCommands;
  }

  get simpleCommandsByName(): readonly ISimpleCommandByName[] {
    return Client.simpleCommandsByName;
  }

  get simpleCommandsByPrefix(): Map<string, ISimpleCommandByName[]> {
    return Client.simpleCommandsByPrefix;
  }

  get simpleCommands(): readonly DSimpleCommand[] {
    return Client.simpleCommands;
  }

  get selectMenuComponents(): readonly DComponent[] {
    return Client.selectMenuComponents;
  }

  get buttonComponents(): readonly DComponent[] {
    return Client.buttonComponents;
  }

  get events(): readonly DOn[] {
    return Client.events;
  }

  get discords(): readonly DDiscord[] {
    return Client.discords;
  }

  get instance(): MetadataStorage {
    return Client.instance;
  }

  // client getters

  get botResolvedGuilds(): Promise<string[]> {
    return resolveIGuilds(this, undefined, this._botGuilds);
  }

  get botGuilds(): IGuild[] {
    return this._botGuilds;
  }

  set botGuilds(value: IGuild[]) {
    this._botGuilds = value;
  }

  get guards(): GuardFunction[] {
    return this._guards;
  }

  set guards(value: GuardFunction[]) {
    this._guards = value;
  }

  get prefix(): IPrefixResolver {
    return this._prefix;
  }

  set prefix(value: IPrefixResolver) {
    this._prefix = value;
  }

  get simpleCommandConfig(): SimpleCommandConfig | undefined {
    return this._simpleCommandConfig;
  }

  set simpleCommandConfig(value: SimpleCommandConfig | undefined) {
    this._simpleCommandConfig = value;
  }

  get botId(): string {
    return this._botId;
  }

  set botId(value: string) {
    this._botId = value;
  }

  get silent(): boolean {
    return this._silent;
  }

  set silent(value: boolean) {
    this._silent = value;
  }

  /**
   * Extend original client class of discord.js
   *
   * @param options - Client options
   * ___
   *
   * [View Documentation](https://discord-ts.js.org/docs/general/client)
   */
  constructor(options: ClientOptions) {
    super(options);

    this._silent = options?.silent ?? true;
    this.guards = options.guards ?? [];
    this.botGuilds = options.botGuilds ?? [];
    this._botId = options.botId ?? "bot";
    this._prefix = options.simpleCommand?.prefix ?? ["!"];
    this._simpleCommandConfig = options.simpleCommand;
    this.logger = options.logger ?? console;
  }

  /**
   * Start bot
   *
   * @param token - Bot token
   * @param log - Enable log
   */
  async login(token: string, log?: boolean): Promise<string> {
    await this.build(log);

    if (log ?? !this.silent) {
      this.logger.log(
        `${this.user?.username ?? this.botId} >> connecting discord...\n`
      );
    }

    return super.login(token);
  }

  /**
   * Print information about all events and commands to your console
   */
  printDebug(): void {
    if (!this.instance.isBuilt) {
      this.logger.log(
        "Build the app before running this method with client.build()"
      );
      return;
    }

    this.logger.log("client >> Events");
    if (this.events.length) {
      this.events.map((event) => {
        const eventName = event.event;
        this.logger.log(
          `>> ${eventName} (${event.classRef.name}.${event.key})`
        );
      });
    } else {
      this.logger.log("\tNo events detected");
    }

    this.logger.log("");

    this.logger.log("client >> application commands");
    if (this.applicationCommands.length) {
      this.applicationCommands.map((DCommand, index) => {
        if (DCommand.botIds.length && !DCommand.botIds.includes(this.botId)) {
          return;
        }
        this.logger.log(
          `${index !== 0 ? "\n" : ""}\t>> ${DCommand.name} (${
            DCommand.classRef.name
          }.${DCommand.key})`
        );
        const printOptions = (
          options: DApplicationCommandOption[],
          depth: number
        ) => {
          if (!options) {
            return;
          }

          const tab = Array(depth).join("\t\t");

          options.forEach((option, optionIndex) => {
            this.logger.log(
              `${
                (option.type === "SUB_COMMAND" ||
                  option.type === "SUB_COMMAND_GROUP") &&
                optionIndex !== 0
                  ? "\n"
                  : ""
              }${tab}>> ${
                option.type === "SUB_COMMAND" ||
                option.type === "SUB_COMMAND_GROUP"
                  ? option.name
                  : option.name
              }: ${option.type.toLowerCase()} (${option.classRef.name}.${
                option.key
              })`
            );
            printOptions(option.options, depth + 1);
          });
        };

        printOptions(DCommand.options, 2);
      });
    } else {
      this.logger.log("\tNo application command detected");
    }

    this.logger.log("");

    this.logger.log("client >> simple commands");
    if (this.simpleCommands.length) {
      this.simpleCommands.map((cmd) => {
        this.logger.log(`\t>> ${cmd.name} (${cmd.classRef.name}.${cmd.key})`);
        if (cmd.aliases.length) {
          this.logger.log(`\t\t${"aliases"}:`, cmd.aliases.join(", "));
        }

        const printOptions = (
          options: DSimpleCommandOption[],
          depth: number
        ) => {
          if (!options) {
            return;
          }

          const tab = Array(depth).join("\t\t");
          options.forEach((option) => {
            this.logger.log(
              `${tab}${option.name}: ${SimpleCommandOptionType[option.type]} (${
                option.classRef.name
              }.${option.key})`
            );
          });
        };

        printOptions(cmd.options, 2);
        this.logger.log("");
      });
    } else {
      this.logger.log("\tNo simple commands detected");
    }

    this.logger.log("\n");
  }

  /**
   * Get commands mapped by guild id (in case of multi bot, commands are filtered for this client only)
   * @returns
   */
  async CommandByGuild(): Promise<Map<string, DApplicationCommand[]>> {
    const botResolvedGuilds = await this.botResolvedGuilds;

    // # group guild commands by guildId
    const guildDCommandStore = new Map<Snowflake, DApplicationCommand[]>();
    const allGuildDCommands = this.applicationCommands.filter(
      (DCommand) =>
        DCommand.isBotAllowed(this.botId) &&
        [...botResolvedGuilds, ...DCommand.guilds].length
    );

    // group single guild commands together
    await Promise.all(
      allGuildDCommands.map(async (DCommand) => {
        const guilds = await resolveIGuilds(this, DCommand, [
          ...botResolvedGuilds,
          ...DCommand.guilds,
        ]);

        guilds.forEach((guild) =>
          guildDCommandStore.set(guild, [
            ...(guildDCommandStore.get(guild) ?? []),
            DCommand,
          ])
        );
      })
    );

    return guildDCommandStore;
  }

  /**
   * Initialize all the @Slash with their permissions
   */
  async initApplicationCommands(options?: {
    global?: InitCommandOptions;
    guild?: InitCommandOptions;
  }): Promise<void> {
    const allGuildPromises: Promise<void>[] = [];
    const guildDCommandStore = await this.CommandByGuild();

    // run task to add/update/delete slashes for guilds
    guildDCommandStore.forEach((DCommands, guildId) => {
      // If bot is not in guild, skip it
      const guild = this.guilds.cache.get(guildId);
      if (!guild) {
        return;
      }

      allGuildPromises.push(
        this.initGuildApplicationCommands(guildId, DCommands, options?.guild)
      );
    });

    await Promise.all([
      Promise.all(allGuildPromises),
      this.initGlobalApplicationCommands(options?.global),
    ]);
  }

  /**
   * Init application commands for guild
   * @param guildId - Guild identifier
   * @param DCommands - Array of commands
   * @param options - Options
   */
  async initGuildApplicationCommands(
    guildId: string,
    DCommands: DApplicationCommand[],
    options?: InitCommandOptions
  ): Promise<void> {
    const botResolvedGuilds = await this.botResolvedGuilds;

    const guild = this.guilds.cache.get(guildId);
    if (!guild) {
      this.logger.log(
        `${
          this.user?.username ?? this.botId
        } >> initGuildApplicationCommands: guild unavailable: ${guildId}`
      );
      return;
    }

    // fetch already registered application command
    const ApplicationCommands = await guild.commands.fetch();

    // filter only unregistered application command
    const added = DCommands.filter(
      (DCommand) =>
        !ApplicationCommands.find(
          (cmd) => cmd.name === DCommand.name && cmd.type === DCommand.type
        )
    );

    // filter application command to update

    const commandToUpdate: ApplicationCommandMixin[] = [];

    await Promise.all(
      DCommands.map(async (DCommand) => {
        const findCommand = ApplicationCommands.find(
          (cmd) => cmd.name === DCommand.name && cmd.type === DCommand.type
        );

        if (!findCommand) {
          return;
        }

        const rawData = await DCommand.toJSON(
          new ApplicationGuildMixin(guild, DCommand)
        );

        const commandJson = findCommand.toJSON() as ApplicationCommandData;

        // Solution for sorting, channel types to ensure equal does not fail
        if (commandJson.type === "CHAT_INPUT") {
          commandJson.options?.forEach((op) => {
            if (op.type === "SUB_COMMAND_GROUP") {
              op.options?.forEach((op1) => {
                op1.options?.forEach((op2) => {
                  if (op2.type === "CHANNEL") {
                    op2.channelTypes?.sort(); // sort mutate array
                  }
                });
              });
            }

            if (op.type === "SUB_COMMAND") {
              op.options?.forEach((op1) => {
                if (op1.type === "CHANNEL") {
                  op1.channelTypes?.sort(); // sort mutate array
                }
              });
            }

            if (op.type === "CHANNEL") {
              op.channelTypes?.sort(); // sort mutate array
            }
          });
        }

        const isEqual = _.isEqual(
          _.omit(
            commandJson,
            "id",
            "applicationId",
            "guild",
            "guildId",
            "version"
          ),
          rawData
        );

        if (!isEqual) {
          commandToUpdate.push(
            new ApplicationCommandMixin(findCommand, DCommand)
          );
        }
      })
    );

    // filter commands to delete
    const deleted: ApplicationCommand[] = [];
    await Promise.all(
      ApplicationCommands.map(async (cmd) => {
        const DCommandFind = DCommands.find(
          (DCommand) => DCommand.name === cmd.name && DCommand.type === cmd.type
        );

        // delete command if it's not found
        if (!DCommandFind) {
          deleted.push(cmd);
          return;
        }

        const guilds = await resolveIGuilds(this, DCommandFind, [
          ...botResolvedGuilds,
          ...DCommandFind.guilds,
        ]);

        // delete command if it's not registered for given guild
        if (!cmd.guildId || !guilds.includes(cmd.guildId)) {
          deleted.push(cmd);
          return;
        }
      })
    );

    // log the changes to commands if enabled by options or silent mode is turned off
    if (options?.log ?? !this.silent) {
      let str = `${this.user?.username} >> commands >> guild: #${guild}`;

      str += `\n\t>> adding   ${added.length} [${added
        .map((DCommand) => DCommand.name)
        .join(", ")}]`;

      str += `\n\t>> deleting ${deleted.length} [${deleted
        .map((cmd) => cmd.name)
        .join(", ")}]`;

      str += `\n\t>> updating ${commandToUpdate.length} [${commandToUpdate
        .map((cmd) => cmd.command.name)
        .join(", ")}]`;

      str += "\n";

      this.logger.log(str);
    }

    const addOperation = options?.disable?.add
      ? []
      : added.map(async (DCommand) =>
          guild.commands.create(
            await DCommand.toJSON(new ApplicationGuildMixin(guild, DCommand))
          )
        );

    const updateOperation = options?.disable?.update
      ? []
      : commandToUpdate.map(async (cmd) =>
          cmd.command.edit(
            await cmd.instance.toJSON(
              new ApplicationGuildMixin(guild, cmd.instance)
            )
          )
        );

    const deleteOperation = options?.disable?.delete
      ? []
      : deleted.map((cmd) => guild.commands.delete(cmd));

    await Promise.all([
      // add
      ...addOperation,

      // update
      ...updateOperation,

      // delete
      ...deleteOperation,
    ]);
  }

  /**
   * Init global application commands
   *
   * @param options - Options
   */
  async initGlobalApplicationCommands(
    options?: InitCommandOptions
  ): Promise<void> {
    const botResolvedGuilds = await this.botResolvedGuilds;

    // # initialize add/update/delete task for global commands
    const AllCommands = (await this.fetchApplicationCommands())?.filter(
      (cmd) => !cmd.guild
    );
    const DCommands = this.applicationCommands.filter(
      (DCommand) =>
        ![...botResolvedGuilds, ...DCommand.guilds].length &&
        (!DCommand.botIds.length || DCommand.botIds.includes(this.botId))
    );
    if (AllCommands) {
      const added = DCommands.filter(
        (DCommand) =>
          !AllCommands.find(
            (cmd) => cmd.name === DCommand.name && cmd.type === DCommand.type
          )
      );

      const commandToUpdate: ApplicationCommandMixin[] = [];

      await Promise.all(
        DCommands.map(async (DCommand) => {
          const findCommand = AllCommands.find(
            (cmd) => cmd.name === DCommand.name && cmd.type == DCommand.type
          );

          if (!findCommand) {
            return;
          }

          const rawData = await DCommand.toJSON();

          const isEqual = _.isEqual(
            _.omit(
              findCommand.toJSON() as JSON,
              "id",
              "applicationId",
              "guild",
              "guildId",
              "version"
            ),
            rawData
          );

          if (!isEqual) {
            commandToUpdate.push(
              new ApplicationCommandMixin(findCommand, DCommand)
            );
          }
        })
      );

      const deleted = AllCommands.filter((cmd) =>
        DCommands.every(
          (DCommand) => DCommand.name !== cmd.name || DCommand.type !== cmd.type
        )
      );

      // log the changes to commands if enabled by options or silent mode is turned off
      if (options?.log ?? !this.silent) {
        let str = `${this.user?.username ?? this.botId} >> commands >> global`;

        str += `\n\t>> adding   ${added.length} [${added
          .map((DCommand) => DCommand.name)
          .join(", ")}]`;

        str += `\n\t>> deleting ${deleted.size} [${deleted
          .map((cmd) => cmd.name)
          .join(", ")}]`;

        str += `\n\t>> updating ${commandToUpdate.length} [${commandToUpdate
          .map((cmd) => cmd.command.name)
          .join(", ")}]`;

        str += "\n";

        this.logger.log(str);
      }

      // Only available for Guilds
      // https://discord.js.org/#/docs/main/master/class/ApplicationCommand?scrollTo=setPermissions
      // if (slash.permissions.length <= 0) return;

      await Promise.all([
        // add
        ...(options?.disable?.add
          ? []
          : added.map(async (DCommand) =>
              this.application?.commands.create(await DCommand.toJSON())
            )),
        // update
        ...(options?.disable?.update
          ? []
          : commandToUpdate.map(async (cmd) =>
              cmd.command.edit(await cmd.instance.toJSON())
            )),
        // delete
        ...(options?.disable?.delete
          ? []
          : deleted.map((cmd) => this.application?.commands.delete(cmd))),
      ]);
    }
  }

  /**
   * init all guild command permissions
   *
   * @param log - Enable log
   */
  async initApplicationPermissions(log?: boolean): Promise<void> {
    const guildDCommandStore = await this.CommandByGuild();
    const promises: Promise<void>[] = [];
    guildDCommandStore.forEach((commands, guildId) => {
      promises.push(
        this.initGuildApplicationPermissions(guildId, commands, log)
      );
    });
    await Promise.all(promises);
  }

  /**
   * Update application commands permission by GuildId
   *
   * @param guildId - Guild identifier
   * @param DCommands - Array of commands
   * @param log - Enable log
   */
  async initGuildApplicationPermissions(
    guildId: string,
    DCommands: DApplicationCommand[],
    log?: boolean
  ): Promise<void> {
    const guild = this.guilds.cache.get(guildId);
    if (!guild) {
      this.logger.log(
        `${
          this.user?.username ?? this.botId
        } >> initGuildApplicationPermissions: guild unavailable: ${guildId}`
      );
      return;
    }

    // fetch already registered application command
    const ApplicationCommands = await guild.commands.fetch();

    const commandToUpdate: ApplicationCommandMixin[] = [];

    ApplicationCommands.forEach((cmd) => {
      const findCommand = DCommands.find(
        (DCommand) => DCommand.name === cmd.name
      );

      if (findCommand) {
        commandToUpdate.push(new ApplicationCommandMixin(cmd, findCommand));
      }
    });

    await Promise.all(
      commandToUpdate.map((cmd) => {
        return guild.commands.permissions
          .fetch({ command: cmd.command })
          .then(async (permissions) => {
            const commandPermissions = await cmd.instance.resolvePermissions(
              guild,
              cmd
            );

            if (!_.isEqual(permissions, commandPermissions)) {
              if (log ?? !this.silent) {
                this.logger.log(
                  `${this.user?.username ?? this.botId} >> command: ${
                    cmd.name
                  } >> permissions >> updating >> guild: #${guild}`
                );
              }

              await cmd.command.permissions.set({
                permissions: commandPermissions,
              });
            }
          })
          .catch(async (e: DiscordAPIError) => {
            if (e.code !== 10066) {
              throw e;
            }

            if (!cmd.instance.permissions.length) {
              return;
            }

            const commandPermissions = await cmd.instance.resolvePermissions(
              guild,
              cmd
            );

            if (log ?? !this.silent) {
              this.logger.log(
                `${this.user?.username ?? this.botId} >> command: ${
                  cmd.name
                } >> permissions >> adding >> guild: #${guild}`
              );
            }

            await cmd.command.permissions.set({
              permissions: commandPermissions,
            });
          });
      })
    );
  }

  /**
   * Fetch the existing application commands of a guild or globally
   *
   * @param guildId - The guild id (empty -> globally)
   *
   * @returns
   */
  fetchApplicationCommands(
    guildId?: Snowflake
  ): Promise<Collection<string, ApplicationCommand>> | undefined {
    if (guildId) {
      const guild = this.guilds.cache.get(guildId);
      if (!guild) {
        throw new Error(`Your bot is not in the guild: ${guildId}`);
      }
      return guild.commands.fetch();
    }
    return this.application?.commands.fetch();
  }

  /**
   * Clear the application commands globally or for some guilds
   *
   * @param guilds - The guild Ids (empty -> globally)
   */
  async clearApplicationCommands(...guilds: Snowflake[]): Promise<void> {
    if (guilds.length) {
      await Promise.all(
        guilds.map(async (guild) => {
          // Select and delete the commands of each guild
          const commands = await this.fetchApplicationCommands(guild);
          if (commands) {
            await Promise.all(
              commands.map((value) => {
                this.guilds.cache.get(guild)?.commands.delete(value);
              })
            );
          }
        })
      );
    } else {
      // Select and delete the commands of each guild
      const commands = await this.fetchApplicationCommands();
      if (commands) {
        await Promise.all(
          commands.map(async (command) => {
            await this.application?.commands.delete(command);
          })
        );
      }
    }
  }

  /**
   * Get the group tree of an slash interaction
   * /hello => ["hello"]
   * /test hello => ["test", "hello"]
   * /test hello me => ["test", "hello", "me"]
   *
   * @param interaction - The targeted slash interaction
   *
   * @returns
   */
  getApplicationCommandGroupTree(
    interaction: CommandInteraction | AutocompleteInteraction
  ): string[] {
    const tree: string[] = [];

    const getOptionsTree = (
      option: Partial<CommandInteractionOption> | undefined
    ): void => {
      if (!option) {
        return;
      }

      if (
        !option.type ||
        option.type === "SUB_COMMAND_GROUP" ||
        option.type === "SUB_COMMAND"
      ) {
        if (option.name) {
          tree.push(option.name);
        }
        return getOptionsTree(Array.from(option.options?.values() ?? [])?.[0]);
      }
    };

    getOptionsTree({
      name: interaction.commandName,
      options: Array.from(interaction.options.data.values()),
      type: undefined,
    });

    return tree;
  }

  /**
   * Return the corresponding @Slash from a tree
   *
   * @param tree - Array of string
   *
   * @returns
   */
  getApplicationCommandFromTree(
    tree: string[]
  ): DApplicationCommand | undefined {
    // Find the corresponding @Slash
    return this.applicationCommandSlashesFlat.find((slash) => {
      switch (tree.length) {
        case 1:
          // Simple command /hello
          return (
            slash.group === undefined &&
            slash.subgroup === undefined &&
            slash.name === tree[0] &&
            slash.type === "CHAT_INPUT"
          );
        case 2:
          // Simple grouped command
          // /permission user perm
          return (
            slash.group === tree[0] &&
            slash.subgroup === undefined &&
            slash.name === tree[1] &&
            slash.type === "CHAT_INPUT"
          );
        case 3:
          // Grouped and subgrouped command
          // /permission user perm
          return (
            slash.group === tree[0] &&
            slash.subgroup === tree[1] &&
            slash.name === tree[2] &&
            slash.type === "CHAT_INPUT"
          );
      }
    });
  }

  /**
   * Execute all types of interaction
   *
   * @param interaction - Interaction
   * @param log - Enable log
   *
   * @returns
   */
  executeInteraction(
    interaction: Interaction,
    log?: boolean
  ): Awaited<unknown> {
    if (!interaction) {
      if (log ?? !this.silent) {
        this.logger.log(
          `${this.user?.username ?? this.botId} >> interaction is undefined`
        );
      }
      return;
    }

    // if interaction is a button
    if (interaction.isButton()) {
      return this.executeComponent(this.buttonComponents, interaction, log);
    }

    // if interaction is a select menu
    if (interaction.isSelectMenu()) {
      return this.executeComponent(this.selectMenuComponents, interaction, log);
    }

    // if interaction is context menu
    if (interaction.isContextMenu()) {
      return this.executeContextMenu(interaction, log);
    }

    // If the interaction isn't a slash command, return
    if (interaction.isCommand() || interaction.isAutocomplete()) {
      return this.executeCommandInteraction(interaction, log);
    }
  }

  /**
   * Execute command interaction
   *
   * @param interaction - Interaction instance
   * @param log - Enable log
   *
   * @returns
   */
  executeCommandInteraction(
    interaction: CommandInteraction | AutocompleteInteraction,
    log?: boolean
  ): Awaited<unknown> {
    // Get the interaction group tree
    const tree = this.getApplicationCommandGroupTree(interaction);
    const applicationCommand = this.getApplicationCommandFromTree(tree);

    if (!applicationCommand || !applicationCommand.isBotAllowed(this.botId)) {
      if (log ?? this.silent) {
        this.logger.log(
          `${
            this.user?.username ?? this.botId
          } >> interaction not found, commandName: ${interaction.commandName}`
        );
      }
      return;
    }

    if (interaction.isAutocomplete()) {
      const focusOption = interaction.options.getFocused(true);
      const option = applicationCommand.options.find(
        (op) => op.name === focusOption.name
      );
      if (option && typeof option.autocomplete === "function") {
        option.autocomplete.call(
          DIService.instance.getService(option.from),
          interaction,
          applicationCommand
        );
        return;
      }
    }

    // Parse the options values and inject it into the @Slash method
    return applicationCommand.execute(this.guards, interaction, this);
  }

  /**
   * Execute component interaction
   *
   * @param interaction - Interaction instance
   * @param log - Enable log
   *
   * @returns
   */
  async executeComponent(
    components: readonly DComponent[],
    interaction: ButtonInteraction | SelectMenuInteraction,
    log?: boolean
  ): Promise<unknown> {
    const component = components.find((comp) =>
      comp.isId(interaction.customId)
    );

    if (
      !component ||
      !component.isBotAllowed(this.botId) ||
      !(await component.isGuildAllowed(this, interaction.guildId))
    ) {
      if (log ?? !this.silent) {
        this.logger.log(
          `${
            this.user?.username ?? this.botId
          } >> selectMenu interaction not found, interactionId: ${
            interaction.id
          } | customId: ${interaction.customId}`
        );
      }
      return;
    }

    return component.execute(this.guards, interaction, this);
  }

  /**
   * Execute context menu interaction
   *
   * @param interaction - Interaction instance
   * @param log - Enable log
   *
   * @returns
   */
  async executeContextMenu(
    interaction: ContextMenuInteraction,
    log?: boolean
  ): Promise<unknown> {
    const applicationCommand = interaction.isUserContextMenu()
      ? this.applicationCommandUsers.find(
          (cmd) => cmd.name === interaction.commandName
        )
      : this.applicationCommandMessages.find(
          (cmd) => cmd.name === interaction.commandName
        );

    if (
      !applicationCommand ||
      !applicationCommand.isBotAllowed(this.botId) ||
      !(await applicationCommand.isGuildAllowed(this, interaction.guildId))
    ) {
      if (log ?? !this.silent) {
        this.logger.log(
          `${
            this.user?.username ?? this.botId
          } >> context interaction not found, name: ${interaction.commandName}`
        );
      }
      return;
    }

    if (
      applicationCommand.botIds.length &&
      !applicationCommand.botIds.includes(this.botId)
    ) {
      return;
    }

    return applicationCommand.execute(this.guards, interaction, this);
  }

  /**
   * Fetch prefix for message
   *
   * @param message - Message instance
   *
   * @returns
   */
  async getMessagePrefix(message: Message): Promise<IPrefix> {
    if (typeof this.prefix !== "function") {
      return _.isArray(this.prefix) ? [...this.prefix] : [this.prefix];
    }

    return [...(await this.prefix(message))];
  }

  /**
   * Parse command message
   *
   * @param prefix - Command prefix
   * @param message - Original message
   * @param caseSensitive - Execute case-sensitively
   *
   * @returns
   */
  async parseCommand(
    prefix: IPrefix,
    message: Message,
    caseSensitive = false
  ): Promise<SimpleCommandParseType | SimpleCommandMessage> {
    const mappedPrefix = Array.from(this.simpleCommandsByPrefix.keys());
    const prefixRegex = RegExp(
      `^(${[...prefix, ...mappedPrefix]
        .map((pfx) => _.escapeRegExp(pfx))
        .join("|")})`
    );

    const isCommand = prefixRegex.test(message.content);
    if (!isCommand) {
      return SimpleCommandParseType.notCommand;
    }

    const matchedPrefix = prefixRegex.exec(message.content)?.at(1) ?? "unknown";
    const isPrefixBaseCommand = mappedPrefix.includes(matchedPrefix);
    const contentWithoutPrefix =
      message.content.replace(prefixRegex, "").trim() + " ";

    const commandRaw = (
      isPrefixBaseCommand
        ? this.simpleCommandsByPrefix.get(matchedPrefix) ?? []
        : this.simpleCommandsByName
    ).find((cmd) => {
      if (caseSensitive) {
        return contentWithoutPrefix.startsWith(`${cmd.name} `);
      }

      return contentWithoutPrefix
        .toLowerCase()
        .startsWith(`${cmd.name.toLowerCase()} `);
    });

    if (!commandRaw) {
      return SimpleCommandParseType.notFound;
    }

    const commandArgs = contentWithoutPrefix
      .replace(new RegExp(commandRaw.name, "i"), "")
      .trim();

    const command = new SimpleCommandMessage(
      matchedPrefix,
      commandArgs,
      message,
      commandRaw.command,
      this.simpleCommandConfig?.argSplitter
    );

    command.options = await command.resolveOptions();

    return command;
  }

  /**
   * Execute the corresponding @SimpleCommand based on an message instance
   *
   * @param message - Message instance
   * @param options - Options
   *
   * @returns
   */
  async executeCommand(
    message: Message,
    options?: {
      caseSensitive?: boolean;
      forcePrefixCheck?: boolean;
      log?: boolean;
    }
  ): Promise<unknown> {
    if (!message) {
      if (options?.log ?? !this.silent) {
        this.logger.log(
          `${
            this.user?.username ?? this.botId
          } >> executeCommand >> message is undefined`
        );
      }
      return;
    }

    const prefix = await this.getMessagePrefix(message);
    if (!prefix) {
      if (options?.log ?? !this.silent) {
        this.logger.log(
          `${
            this.user?.username ?? this.botId
          } >> executeCommand >> command prefix not found`
        );
      }
      return;
    }

    const command = await this.parseCommand(
      prefix,
      message,
      options?.caseSensitive ?? false
    );
    if (command === SimpleCommandParseType.notCommand) {
      return;
    }

    if (command === SimpleCommandParseType.notFound) {
      const handleNotFound = this.simpleCommandConfig?.responses?.notFound;
      if (handleNotFound) {
        if (typeof handleNotFound === "string") {
          message.reply(handleNotFound);
        } else {
          handleNotFound(message);
        }
      }
      return;
    }

    // validate bot id
    if (!command.info.isBotAllowed(this.botId)) {
      return;
    }

    // validate guild id
    if (!command.info.isGuildAllowed(this, command, message.guildId)) {
      return;
    }

    // check dm allowed or not
    if (!command.info.directMessage && !message.guild) {
      return;
    }

    // permission works only if guild present
    if (command.message.guild) {
      // check for member permissions
      const permissions = await command.info.resolvePermissions(
        command.message.guild,
        command
      );

      const defaultPermission =
        typeof command.info.defaultPermission === "boolean"
          ? command.info.defaultPermission
          : await command.info.defaultPermission.resolver(command);

      const userPermissions = permissions.filter((perm) =>
        perm.type === "USER" && defaultPermission
          ? !perm.permission
          : perm.permission
      );

      const rolePermissions = permissions.filter((perm) =>
        perm.type === "ROLE" && defaultPermission
          ? !perm.permission
          : perm.permission
      );

      const isUserIdPresent =
        userPermissions.some((perm) => perm.id === message.member?.id) ||
        rolePermissions.some((perm) =>
          message.member?.roles.cache.has(perm.id)
        );

      // user is not allowed to access this command
      if (defaultPermission ? isUserIdPresent : !isUserIdPresent) {
        const unauthorizedResponse =
          this.simpleCommandConfig?.responses?.unauthorized;

        if (unauthorizedResponse) {
          if (typeof unauthorizedResponse === "string") {
            message.reply(unauthorizedResponse);
            return;
          }
          await unauthorizedResponse(command);
        }
        return;
      }
    }

    return command.info.execute(this.guards, command, this);
  }

  /**
   * Trigger an event manually (used for testing)
   *
   * @param event - The event
   * @param params - Params to inject
   * @param once - Trigger an once event
   *
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  trigger(event: DiscordEvents, params: any, once = false): Promise<any[]> {
    return this.instance.trigger(this.guards, event, this, once)(params);
  }

  /**
   * Manually build client
   *
   * @param log - Enable log
   */
  async build(log?: boolean): Promise<void> {
    if (this._isBuilt) {
      return;
    }

    this._isBuilt = true;
    await this.instance.build();

    if (log ?? !this.silent) {
      this.printDebug();
    }

    this.instance.usedEvents.map((on) => {
      if (on.once) {
        this.once(
          on.event,
          this.instance.trigger(this.guards, on.event, this, true)
        );
      } else {
        this.on(on.event, this.instance.trigger(this.guards, on.event, this));
      }
    });
  }
}
