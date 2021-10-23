import * as _ from "lodash";
import {
  ApplicationCommand,
  Client as ClientJS,
  Collection,
  CommandInteraction,
  CommandInteractionOption,
  Interaction,
  Message,
  Snowflake,
} from "discord.js";
import {
  ApplicationCommandMixin,
  ApplicationGuildMixin,
  ClientOptions,
  DApplicationCommand,
  DApplicationCommandOption,
  DComponentButton,
  DComponentSelectMenu,
  DDiscord,
  DOn,
  DSimpleCommand,
  DSimpleCommandOption,
  DiscordEvents,
  GuardFunction,
  GuildNotFoundError,
  IGuild,
  InitCommandConfig,
  MetadataStorage,
  SimpleCommandConfig,
  SimpleCommandMessage,
  resolveIGuilds,
} from ".";

/**
 * Extend original client class of discord.js
 * @param options object
 * ___
 * [View Documentation](https://discord-ts.js.org/docs/general/client)
 */
export class Client extends ClientJS {
  private _botId: string;
  private _prefix: string | ((message: Message) => Promise<string> | string);
  private _simpleCommandConfig?: SimpleCommandConfig;
  private _silent: boolean;
  private _botGuilds: IGuild[] = [];
  private _guards: GuardFunction[] = [];

  get botGuilds(): IGuild[] {
    return this._botGuilds;
  }
  set botGuilds(value: IGuild[]) {
    this._botGuilds = value;
  }
  get botGuildsResolved(): Promise<string[]> {
    return resolveIGuilds(this, undefined, this._botGuilds);
  }

  get guards(): GuardFunction[] {
    return this._guards;
  }
  set guards(value: GuardFunction[]) {
    this._guards = value;
  }

  get prefix(): string | ((message: Message) => string | Promise<string>) {
    return this._prefix;
  }
  set prefix(value: string | ((message: Message) => string | Promise<string>)) {
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

  static get applicationCommands(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommands;
  }
  get applicationCommands(): readonly DApplicationCommand[] {
    return Client.applicationCommands;
  }

  static get simpleCommands(): readonly DSimpleCommand[] {
    return MetadataStorage.instance.simpleCommands;
  }
  get simpleCommands(): readonly DSimpleCommand[] {
    return Client.simpleCommands;
  }

  static get allSimpleCommands(): readonly {
    name: string;
    command: DSimpleCommand;
  }[] {
    return MetadataStorage.instance.allSimpleCommands;
  }
  get allSimpleCommands(): readonly {
    name: string;
    command: DSimpleCommand;
  }[] {
    return Client.allSimpleCommands;
  }

  static get buttons(): readonly DComponentButton[] {
    return MetadataStorage.instance.buttonComponents;
  }
  get buttons(): readonly DComponentButton[] {
    return Client.buttons;
  }

  static get selectMenus(): readonly DComponentSelectMenu[] {
    return MetadataStorage.instance.selectMenuComponents;
  }
  get selectMenus(): readonly DComponentSelectMenu[] {
    return Client.selectMenus;
  }

  static get allApplicationCommands(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.allApplicationCommands;
  }
  get allApplicationCommands(): readonly DApplicationCommand[] {
    return Client.allApplicationCommands;
  }

  static get events(): readonly DOn[] {
    return MetadataStorage.instance.events;
  }
  get events(): readonly DOn[] {
    return Client.events;
  }

  static get discords(): readonly DDiscord[] {
    return MetadataStorage.instance.discords;
  }
  get discord(): readonly DDiscord[] {
    return Client.discords;
  }

  static get decorators(): MetadataStorage {
    return MetadataStorage.instance;
  }
  get decorators(): MetadataStorage {
    return MetadataStorage.instance;
  }

  get silent(): boolean {
    return this._silent;
  }
  set silent(value: boolean) {
    this._silent = value;
  }

  /**
   * Extend original client class of discord.js
   * @param options object
   * ___
   * [View Documentation](https://discord-ts.js.org/docs/general/client)
   */
  constructor(options: ClientOptions) {
    super(options);
    MetadataStorage.classes = [
      ...MetadataStorage.classes,
      ...(options?.classes ?? []),
    ];

    this._silent = !!options?.silent;
    this.guards = options.guards ?? [];
    this.botGuilds = options.botGuilds ?? [];
    this._botId = options.botId ?? "bot";
    this._prefix = options.simpleCommand?.prefix ?? "!";
    this._simpleCommandConfig = options.simpleCommand;
  }

  /**
   * Start your bot
   * @param token The bot token
   * @param loadClasses A list of glob path or classes
   */
  async login(token: string): Promise<string> {
    await this.decorators.build();

    if (!this.silent) {
      console.log("Events");
      if (this.events.length) {
        this.events.map((event) => {
          const eventName = event.event;
          console.log(`>> ${eventName} (${event.classRef.name}.${event.key})`);
        });
      } else {
        console.log("   No events detected");
      }

      console.log("");

      console.log("Slashes");
      if (this.applicationCommands.length) {
        this.applicationCommands.map((DCommand) => {
          if (DCommand.botIds.length && !DCommand.botIds.includes(this.botId)) {
            return;
          }
          console.log(
            `>> ${DCommand.name} (${DCommand.classRef.name}.${DCommand.key})`
          );
          const printOptions = (
            options: DApplicationCommandOption[],
            depth: number
          ) => {
            if (!options) {
              return;
            }

            const tab = Array(depth).join("      ");

            options.forEach((option) => {
              console.log(
                `${tab}(option) ${option.name}: ${option.type} (${option.classRef.name}.${option.key})`
              );
              printOptions(option.options, depth + 1);
            });
          };

          printOptions(DCommand.options, 2);

          console.log("");
        });
      } else {
        console.log("   No slashes detected");
      }

      console.log("Simple Commands");
      if (this.simpleCommands.length) {
        this.simpleCommands.map((cmd) => {
          console.log(`>> ${cmd.name} (${cmd.classRef.name}.${cmd.key})`);
          if (cmd.aliases.length) {
            console.log("      aliases:", cmd.aliases.join(", "));
          }

          const printOptions = (
            options: DSimpleCommandOption[],
            depth: number
          ) => {
            if (!options) {
              return;
            }

            const tab = Array(depth).join("      ");
            options.forEach((option) => {
              console.log(
                `${tab}(option) ${option.name}: ${option.type} (${option.classRef.name}.${option.key})`
              );
            });
          };

          printOptions(cmd.options, 2);
          console.log("");
        });
      } else {
        console.log("   No simple commands detected");
      }
    }

    this.decorators.usedEvents.map((on) => {
      if (on.once) {
        this.once(
          on.event,
          this.decorators.trigger(this.guards, on.event, this, true)
        );
      } else {
        this.on(on.event, this.decorators.trigger(this.guards, on.event, this));
      }
    });

    return super.login(token);
  }

  /**
   * Get commands mapped by guildid (in case of multi bot, commands are filtered for this client only)
   * @returns
   */
  async CommandByGuild(): Promise<Map<string, DApplicationCommand[]>> {
    const botGuildsResolved = await this.botGuildsResolved;

    // # group guild commands by guildId
    const guildDCommandStore = new Map<Snowflake, DApplicationCommand[]>();
    const allGuildDCommands = this.applicationCommands.filter(
      (DCommand) =>
        [...botGuildsResolved, ...DCommand.guilds].length &&
        (!DCommand.botIds.length || DCommand.botIds.includes(this.botId))
    );

    // group single guild commands together
    await Promise.all(
      allGuildDCommands.map(async (DCommand) => {
        const guilds = await resolveIGuilds(this, DCommand, [
          ...botGuildsResolved,
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
    guild?: InitCommandConfig;
    global?: InitCommandConfig;
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
   * init application commands for guild
   * @param guildId
   * @param DCommands
   * @param log
   */
  async initGuildApplicationCommands(
    guildId: string,
    DCommands: DApplicationCommand[],
    options?: InitCommandConfig
  ): Promise<void> {
    const botGuildsResolved = await this.botGuildsResolved;

    const guild = this.guilds.cache.get(guildId);
    if (!guild) {
      console.log(`initGuildApplicationCommands: guild not found: ${guildId}`);
      return;
    }

    // fetch already registered application command
    const ApplicationCommands = await guild.commands.fetch();

    // filter only unregistered application command
    const added = DCommands.filter(
      (DCommand) =>
        !ApplicationCommands.find((cmd) => cmd.name === DCommand.name)
    );

    // filter application command to update

    const commandToUpdate: ApplicationCommandMixin[] = [];

    await Promise.all(
      DCommands.map(async (DCommand) => {
        const findCommand = ApplicationCommands.find(
          (cmd) => cmd.name === DCommand.name
        );

        if (!findCommand) {
          return;
        }

        const rawData = await DCommand.toJSON({
          channelString: true,
          command: new ApplicationGuildMixin(guild, DCommand),
        });

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

    // filter commands to delete
    const deleted: ApplicationCommand[] = [];
    await Promise.all(
      ApplicationCommands.map(async (cmd) => {
        const DCommandx = DCommands.find(
          (DCommand) => DCommand.name === cmd.name
        );

        // delete command if it's not found
        if (!DCommandx) {
          deleted.push(cmd);
          return;
        }

        const guilds = await resolveIGuilds(this, DCommandx, [
          ...botGuildsResolved,
          ...DCommandx.guilds,
        ]);

        // delete command if it's not registered for given guild
        if (!cmd.guildId || !guilds.includes(cmd.guildId)) {
          deleted.push(cmd);
          return;
        }
      })
    );

    // log the changes to commands in console if enabled by options or silent mode is turned off
    if (options?.log || !this.silent) {
      console.log(
        `${this.user?.username} >> guild: #${guild} >> command >> adding ${
          added.length
        } [${added.map((DCommand) => DCommand.name).join(", ")}]`
      );

      console.log(
        `${this.user?.username} >> guild: #${guild} >> command >> deleting ${
          deleted.length
        } [${deleted.map((cmd) => cmd.name).join(", ")}]`
      );

      console.log(
        `${this.user?.username} >> guild: #${guild} >> command >> updating ${
          commandToUpdate.length
        } [${commandToUpdate.map((cmd) => cmd.command.name).join(", ")}]`
      );
    }

    const addOperation = options?.disable?.add
      ? []
      : added.map(async (DCommand) =>
          guild.commands.create(
            await DCommand.toJSON({
              command: new ApplicationGuildMixin(guild, DCommand),
            })
          )
        );

    const updateOperation = options?.disable?.update
      ? []
      : commandToUpdate.map(async (cmd) =>
          cmd.command.edit(
            await cmd.instance.toJSON({
              command: new ApplicationGuildMixin(guild, cmd.instance),
            })
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
   * init global application commands
   * @param log
   */
  async initGlobalApplicationCommands(
    options?: InitCommandConfig
  ): Promise<void> {
    const botGuildsResolved = await this.botGuildsResolved;

    // # initialize add/update/delete task for global commands
    const AllCommands = (await this.fetchApplicationCommands())?.filter(
      (cmd) => !cmd.guild
    );
    const DCommands = this.applicationCommands.filter(
      (DCommand) =>
        ![...botGuildsResolved, ...DCommand.guilds].length &&
        (!DCommand.botIds.length || DCommand.botIds.includes(this.botId))
    );
    if (AllCommands) {
      const added = DCommands.filter(
        (DCommand) => !AllCommands.find((cmd) => cmd.name === DCommand.name)
      );

      const commandToUpdate: ApplicationCommandMixin[] = [];

      await Promise.all(
        DCommands.map(async (DCommand) => {
          const findCommand = AllCommands.find(
            (cmd) => cmd.name === DCommand.name
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
        DCommands.every((DCommand) => DCommand.name !== cmd.name)
      );

      // log the changes to commands in console if enabled by options or silent mode is turned off
      if (options?.log || !this.silent) {
        console.log(
          `${this.user?.username} >> global >> command >> adding ${
            added.length
          } [${added.map((DCommand) => DCommand.name).join(", ")}]`
        );
        console.log(
          `${this.user?.username} >> global >> command >> deleting ${
            deleted.size
          } [${deleted.map((cmd) => cmd.name).join(", ")}]`
        );
        console.log(
          `${this.user?.username} >> global >> command >> updating ${
            commandToUpdate.length
          } [${commandToUpdate.map((cmd) => cmd.command.name).join(", ")}]`
        );
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
   */
  async initApplicationPermissions(): Promise<void> {
    const guildDCommandStore = await this.CommandByGuild();
    const promises: Promise<void>[] = [];
    guildDCommandStore.forEach((cmds, guildId) => {
      promises.push(this.initGuildApplicationPermissions(guildId, cmds));
    });
    await Promise.all(promises);
  }

  /**
   * Update application commands permission by GuildId
   * @param guildId guild id
   * @param DCommands commands
   */
  async initGuildApplicationPermissions(
    guildId: string,
    DCommands: DApplicationCommand[]
  ): Promise<void> {
    const guild = this.guilds.cache.get(guildId);
    if (!guild) {
      console.log(
        `initGuildApplicationPermissions: guild not found: ${guildId}`
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
            if (
              !_.isEqual(
                permissions,
                await cmd.instance.resolvePermissions(guild, cmd)
              )
            ) {
              if (!this.silent) {
                console.log(
                  `${this.user?.username} >> guild: #${guild} >> updating permission >> ${cmd.name}`
                );
              }
              await cmd.command.permissions.set({
                permissions: await cmd.instance.resolvePermissions(guild, cmd),
              });
            }
          })
          .catch(async () => {
            if (cmd.instance.permissions.length) {
              if (!this.silent) {
                console.log(
                  `${this.user?.username} >> guild: #${guild} >> updating permission >> ${cmd.name}`
                );
              }
              await cmd.command.permissions.set({
                permissions: await cmd.instance.resolvePermissions(guild, cmd),
              });
            }
          });
      })
    );
  }

  /**
   * Fetch the existing application commands of a guild or globally
   * @param guild The guild ID (empty -> globally)
   * @returns
   */
  fetchApplicationCommands(
    guildID?: Snowflake
  ): Promise<Collection<string, ApplicationCommand>> | undefined {
    if (guildID) {
      const guild = this.guilds.cache.get(guildID);
      if (!guild) {
        throw new GuildNotFoundError(guildID);
      }
      return guild.commands.fetch();
    }
    return this.application?.commands.fetch();
  }

  /**
   * Clear the application commands globally or for some guilds
   * @param guilds The guild IDs (empty -> globally)
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
   * @param interaction The targeted slash interaction
   * @returns
   */
  getApplicationCommandGroupTree(interaction: CommandInteraction): string[] {
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
   * @param tree
   * @returns
   */
  getApplicationCommandFromTree(
    tree: string[]
  ): DApplicationCommand | undefined {
    // Find the corresponding @Slash
    return this.allApplicationCommands.find((slash) => {
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
          // Grouped and subgroupped command
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
   * Execute the corresponding @Slash @ButtonComponent @SelectMenuComponent based on an Interaction instance
   * @param interaction The discord.js interaction instance
   * @returns
   */
  async executeInteraction(interaction: Interaction): Promise<unknown> {
    const botGuildsResolved = await this.botGuildsResolved;

    if (!interaction) {
      if (!this.silent) {
        console.log("Interaction is undefined");
      }
      return;
    }

    // if interaction is a button
    if (interaction.isButton()) {
      const button = this.buttons.find(
        (DButton) => DButton.id === interaction.customId
      );

      const guilds: string[] = [];

      if (button) {
        guilds.push(
          ...(await resolveIGuilds(this, button, [
            ...botGuildsResolved,
            ...button.guilds,
          ]))
        );
      }

      if (
        !button ||
        (interaction.guild &&
          guilds.length &&
          !guilds.includes(interaction.guild.id)) ||
        (button.botIds.length && !button.botIds.includes(this.botId))
      ) {
        if (!this.silent) {
          console.log(
            `button interaction not found, interactionID: ${interaction.id} | customID: ${interaction.customId}`
          );
        }
        return;
      }

      return button.execute(this.guards, interaction, this);
    }

    // if interaction is a button
    if (interaction.isSelectMenu()) {
      const menu = this.selectMenus.find(
        (DSelectMenu) => DSelectMenu.id === interaction.customId
      );

      const guilds: string[] = [];

      if (menu) {
        guilds.push(
          ...(await resolveIGuilds(this, menu, [
            ...botGuildsResolved,
            ...menu.guilds,
          ]))
        );
      }

      if (
        !menu ||
        (interaction.guild &&
          guilds.length &&
          !guilds.includes(interaction.guild.id)) ||
        (menu.botIds.length && !menu.botIds.includes(this.botId))
      ) {
        if (!this.silent) {
          console.log(
            `selectMenu interaction not found, interactionID: ${interaction.id} | customID: ${interaction.customId}`
          );
        }
        return;
      }

      return menu.execute(this.guards, interaction, this);
    }

    // if interaction is context menu
    if (interaction.isContextMenu()) {
      const applicationCommand = this.allApplicationCommands.find(
        (cmd) =>
          cmd.type !== "CHAT_INPUT" && cmd.name === interaction.commandName
      );

      const guilds: string[] = [];

      if (applicationCommand) {
        guilds.push(
          ...(await resolveIGuilds(this, applicationCommand, [
            ...botGuildsResolved,
            ...applicationCommand.guilds,
          ]))
        );
      }

      if (
        !applicationCommand ||
        (interaction.guild &&
          guilds.length &&
          !guilds.includes(interaction.guild.id)) ||
        (applicationCommand.botIds.length &&
          !applicationCommand.botIds.includes(this.botId))
      ) {
        if (!this.silent) {
          console.log(
            `context menu interaction not found, name: ${interaction.commandName}`
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

    // If the interaction isn't a slash command, return
    if (interaction.isCommand()) {
      // Get the interaction group tree
      const tree = this.getApplicationCommandGroupTree(interaction);
      const applicationCommand = this.getApplicationCommandFromTree(tree);

      if (
        !applicationCommand ||
        (applicationCommand.botIds.length &&
          !applicationCommand.botIds.includes(this.botId))
      ) {
        if (this.silent) {
          console.log(
            `interaction not found, commandName: ${interaction.commandName}`
          );
        }
        return;
      }

      // Parse the options values and inject it into the @Slash method
      return applicationCommand.execute(this.guards, interaction, this);
    }
  }

  /**
   * Fetch prefix for message
   * @param message messsage instance
   * @returns
   */
  getMessagePrefix(message: Message): string | Promise<string> {
    if (typeof this.prefix === "string") {
      return this.prefix;
    }

    return this.prefix(message);
  }

  /**
   *
   * @param prefix command prefix
   * @param message original message
   * @param caseSensitive allow insentive execution for simple commands
   * @returns
   */
  parseCommand(
    prefix: string,
    message: Message,
    caseSensitive = false
  ): "notCommand" | "notFound" | SimpleCommandMessage {
    const escapePrefix = prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const prefixRegex = RegExp(`^${escapePrefix}`);
    const isCommand = prefixRegex.test(message.content);
    if (!isCommand) {
      return "notCommand";
    }

    const contentWithoutPrefix =
      message.content.replace(prefixRegex, "").trim() + " ";

    const commandRaw = this.allSimpleCommands.find((cmd) =>
      caseSensitive
        ? contentWithoutPrefix.startsWith(`${cmd.name} `)
        : contentWithoutPrefix
            .toLowerCase()
            .startsWith(`${cmd.name.toLowerCase()} `)
    );

    if (!commandRaw) {
      return "notFound";
    }

    const commandArgs = contentWithoutPrefix
      .replace(new RegExp(commandRaw.name, "i"), "")
      .trim();

    const command = new SimpleCommandMessage(
      prefix,
      commandArgs,
      message,
      commandRaw.command,
      this.simpleCommandConfig?.argSplitter
    );

    return command;
  }

  /**
   * Execute the corresponding @SimpleCommand based on an message instance
   * @param message The discord.js message instance
   * @param options execution options ex. caseSensitive
   * @returns
   */
  async executeCommand(
    message: Message,
    options?: { caseSensitive?: boolean }
  ): Promise<unknown> {
    const botGuildsResolved = await this.botGuildsResolved;

    if (!message) {
      if (!this.silent) {
        console.log("message is undefined");
      }
      return;
    }

    const prefix = await this.getMessagePrefix(message);
    if (!prefix) {
      if (!this.silent) {
        console.log("command prefix not found");
      }
      return;
    }

    const command = this.parseCommand(
      prefix,
      message,
      options?.caseSensitive ?? false
    );
    if (command === "notCommand") {
      return;
    }

    if (command === "notFound") {
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
    if (
      command.info.botIds.length &&
      !command.info.botIds.includes(this.botId)
    ) {
      return;
    }

    // validate guild id
    const commandGuilds = await resolveIGuilds(this, command, [
      ...botGuildsResolved,
      ...command.info.guilds,
    ]);
    if (
      message.guild?.id &&
      commandGuilds.length &&
      !commandGuilds.includes(message.guild.id)
    ) {
      return;
    }

    // check dm allowed or not
    if (!command.info.directMessage && !message.guild) {
      return;
    }

    // permission works only if guild persent
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
          this.simpleCommandConfig?.responses?.unauthorised;

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
   * Manually trigger an event (used for tests)
   * @param event The event
   * @param params Params to inject
   * @param once Trigger an once event
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  trigger(event: DiscordEvents, params: any, once = false): Promise<any[]> {
    return this.decorators.trigger(this.guards, event, this, once)(params);
  }

  /**
   * Manually build the app
   */
  async build(): Promise<void> {
    await this.decorators.build();
  }
}
