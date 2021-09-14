/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApplicationCommand,
  Client as ClientJS,
  CommandInteraction,
  CommandInteractionOption,
  Interaction,
  Message,
  Snowflake,
} from "discord.js";
import {
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
  MetadataStorage,
  SimpleCommandMessage,
} from ".";

/**
 * Extend original client class of discord.js
 * @param options object
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/general/client)
 */
export class Client extends ClientJS {
  private _botId: string;
  private _prefix: string | ((message: Message) => Promise<string>);
  private _unauthorizedHandler?:
    | string
    | ((command: SimpleCommandMessage) => Promise<void>);
  private _silent: boolean;
  private _botGuilds: Snowflake[] = [];
  private _guards: GuardFunction[] = [];

  get botGuilds() {
    return this._botGuilds;
  }
  set botGuilds(value) {
    this._botGuilds = value;
  }

  get guards() {
    return this._guards;
  }
  set guards(value) {
    this._guards = value;
  }

  get prefix() {
    return this._prefix;
  }
  set prefix(value) {
    this._prefix = value;
  }

  get unauthorizedHandler() {
    return this._unauthorizedHandler;
  }
  set unauthorizedHandler(value) {
    this._unauthorizedHandler = value;
  }

  get botId() {
    return this._botId;
  }
  set botId(value) {
    this._botId = value;
  }

  static get applicationCommands() {
    return MetadataStorage.instance
      .applicationCommands as readonly DApplicationCommand[];
  }
  get applicationCommands() {
    return Client.applicationCommands;
  }

  static get simpleCommands() {
    return MetadataStorage.instance.simpleCommands as readonly DSimpleCommand[];
  }
  get simpleCommands() {
    return Client.simpleCommands;
  }

  static get allSimpleCommands() {
    return MetadataStorage.instance.allSimpleCommands as readonly {
      name: string;
      command: DSimpleCommand;
    }[];
  }
  get allSimpleCommands() {
    return Client.allSimpleCommands;
  }

  static get buttons() {
    return MetadataStorage.instance
      .buttonComponents as readonly DComponentButton[];
  }
  get buttons() {
    return Client.buttons;
  }

  static get selectMenus() {
    return MetadataStorage.instance
      .selectMenuComponents as readonly DComponentSelectMenu[];
  }
  get selectMenus() {
    return Client.selectMenus;
  }

  static get allApplicationCommands() {
    return MetadataStorage.instance
      .allApplicationCommands as readonly DApplicationCommand[];
  }
  get allApplicationCommands() {
    return Client.allApplicationCommands;
  }

  static get events() {
    return MetadataStorage.instance.events as readonly DOn[];
  }
  get events() {
    return Client.events;
  }

  static get discords() {
    return MetadataStorage.instance.discords as readonly DDiscord[];
  }
  get discord() {
    return Client.discords;
  }

  static get decorators() {
    return MetadataStorage.instance;
  }
  get decorators() {
    return MetadataStorage.instance;
  }

  get silent() {
    return this._silent;
  }
  set silent(value: boolean) {
    this._silent = value;
  }

  /**
   * Extend original client class of discord.js
   * @param options object
   * ___
   * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/general/client)
   */
  constructor(options: ClientOptions) {
    super(options);
    MetadataStorage.classes = [
      ...MetadataStorage.classes,
      ...(options?.classes ?? []),
    ];

    this._silent = !!options?.silent;
    this.guards = options.guards ?? [];
    this.botGuilds = options.botGuilds?.filter((guild) => !!guild) ?? [];
    this._botId = options.botId ?? "bot";
    this._prefix = options.prefix ?? "!";
    this._unauthorizedHandler = options.commandUnauthorizedHandler;
  }

  /**
   * Start your bot
   * @param token The bot token
   * @param loadClasses A list of glob path or classes
   */
  async login(token: string) {
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
        this.applicationCommands.map((slash) => {
          console.log(`>> ${slash.name} (${slash.classRef.name}.${slash.key})`);
          const printOptions = (
            options: DApplicationCommandOption[],
            depth: number
          ) => {
            if (!options) return;

            const tab = Array(depth).join("      ");

            options.forEach((option) => {
              console.log(
                `${tab}(option) ${option.name}: ${option.type} (${option.classRef.name}.${option.key})`
              );
              printOptions(option.options, depth + 1);
            });
          };

          printOptions(slash.options, 2);

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
            if (!options) return;
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

    this.decorators.usedEvents.map(async (on) => {
      if (on.once) {
        this.once(on.event, this.decorators.trigger(on.event, this, true));
      } else {
        this.on(on.event, this.decorators.trigger(on.event, this));
      }
    });

    return super.login(token);
  }

  /**
   * Initialize all the @Slash with their permissions
   */
  async initApplicationCommands(options?: {
    log: { forGuild: boolean; forGlobal: boolean };
  }) {
    // # group guild commands by guildId
    const guildDCommandStore = new Map<Snowflake, DApplicationCommand[]>();
    const allGuildDCommands = this.applicationCommands.filter(
      (DCommand) => DCommand.guilds?.length
    );

    // group single guild commands together
    allGuildDCommands.forEach((DCommand) => {
      DCommand.guilds.forEach((guild) =>
        guildDCommandStore.set(guild, [
          ...(guildDCommandStore.get(guild) ?? []),
          DCommand,
        ])
      );
    });

    const allGuildPromises: Promise<void>[] = [];

    // run task to add/update/delete slashes for guilds
    guildDCommandStore.forEach(async (DCommands, guildId) => {
      // If bot is not in guild, skip it
      const guild = this.guilds.cache.get(guildId);
      if (!guild) return;
      allGuildPromises.push(
        this.initGuildApplicationCommands(
          guildId,
          DCommands,
          options?.log.forGuild
        )
      );
    });

    return await Promise.all([
      Promise.all(allGuildPromises),
      this.initGlobalApplicationCommands(options?.log.forGlobal),
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
    log?: boolean
  ) {
    const guild = this.guilds.cache.get(guildId);
    if (!guild) throw Error(`${guildId} guild not found`);

    // fetch already registered command
    const ApplicationCommands = await guild.commands.fetch();

    // filter only unregistered command
    const added = DCommands.filter(
      (DCommand) =>
        !ApplicationCommands.find((cmd) => cmd.name === DCommand.name) &&
        (!DCommand.botIds.length || DCommand.botIds.includes(this.botId))
    );

    // filter slashesx to update
    const updated = DCommands.map<
      [ApplicationCommand | undefined, DApplicationCommand]
    >((DCommand) => [
      ApplicationCommands.find(
        (cmd) =>
          cmd.name === DCommand.name &&
          (!DCommand.botIds.length || DCommand.botIds.includes(this.botId))
      ),
      DCommand,
    ]).filter<[ApplicationCommand, DApplicationCommand]>(
      (s): s is [ApplicationCommand, DApplicationCommand] => s[0] !== undefined
    );

    // filter commands to delete
    const deleted = ApplicationCommands.filter(
      (cmd) =>
        !this.applicationCommands.find(
          (DCommand) =>
            cmd.name === DCommand.name &&
            cmd.guild &&
            DCommand.guilds.includes(cmd.guild.id) &&
            (!DCommand.botIds.length || DCommand.botIds.includes(this.botId))
        )
    );

    // log the changes to commands in console if enabled by options or silent mode is turned off
    if (log || !this.silent) {
      console.log(
        `${this.user?.username} >> guild: #${guild} >> command >> adding ${
          added.length
        } [${added.map((DCommand) => DCommand.name).join(", ")}]`
      );

      console.log(
        `${this.user?.username} >> guild: #${guild} >> command >> deleting ${
          deleted.size
        } [${deleted.map((cmd) => cmd.name).join(", ")}]`
      );

      console.log(
        `${this.user?.username} >> guild: #${guild} >> command >> updating ${updated.length}`
      );
    }

    await Promise.all([
      // add and set permissions
      ...added.map((DCommand) =>
        guild.commands.create(DCommand.toObject()).then((cmd) => {
          if (DCommand.permissions.length) {
            cmd.permissions.set({ permissions: DCommand.permissions });
          }
          return cmd;
        })
      ),

      // update and set permissions
      ...updated.map((command) =>
        command[0].edit(command[1].toObject()).then((cmd) => {
          if (command[1].permissions.length) {
            cmd.permissions.set({ permissions: command[1].permissions });
          }
          return cmd;
        })
      ),

      // delete
      ...deleted.map((cmd) => guild.commands.delete(cmd)),
    ]);
  }

  /**
   * init global application commands
   * @param log
   */
  async initGlobalApplicationCommands(log?: boolean) {
    // # initialize add/update/delete task for global commands
    const AllCommands = (await this.fetchApplicationCommands())?.filter(
      (cmd) => !cmd.guild
    );
    const DCommands = this.applicationCommands.filter((s) => !s.guilds?.length);
    if (AllCommands) {
      const added = DCommands.filter(
        (DCommand) => !AllCommands.find((cmd) => cmd.name === DCommand.name)
      );

      const updated = DCommands.map<
        [ApplicationCommand | undefined, DApplicationCommand]
      >((DCommand) => [
        AllCommands.find((cmd) => cmd.name === DCommand.name),
        DCommand,
      ]).filter<[ApplicationCommand, DApplicationCommand]>(
        (ob): ob is [ApplicationCommand, DApplicationCommand] =>
          ob[0] !== undefined
      );

      const deleted = AllCommands.filter((cmd) =>
        DCommands.every((DCommand) => DCommand.name !== cmd.name)
      );

      // log the changes to commands in console if enabled by options or silent mode is turned off
      if (log || !this.silent) {
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
          `${this.user?.username} >> global >> command >> updating ${updated.length}`
        );
      }

      // Only available for Guilds
      // https://discord.js.org/#/docs/main/master/class/ApplicationCommand?scrollTo=setPermissions
      // if (slash.permissions.length <= 0) return;

      await Promise.all([
        // add
        ...added.map((DCommand) =>
          this.application?.commands.create(DCommand.toObject())
        ),
        // update
        ...updated.map((ob) => ob[0].edit(ob[1].toObject())),
        // delete
        ...deleted.map((cmd) => this.application?.commands.delete(cmd)),
      ]);
    }
  }

  /**
   * Fetch the existing application commands of a guild or globaly
   * @param guild The guild ID (empty -> globaly)
   * @returns
   */
  async fetchApplicationCommands(guildID?: Snowflake) {
    if (guildID) {
      const guild = this.guilds.cache.get(guildID);
      if (!guild) {
        throw new GuildNotFoundError(guildID);
      }
      return await guild.commands.fetch();
    }
    return await this.application?.commands.fetch();
  }

  /**
   * Clear the application commands globaly or for some guilds
   * @param guilds The guild IDs (empty -> globaly)
   */
  async clearApplicationCommands(...guilds: Snowflake[]) {
    if (guilds.length) {
      await Promise.all(
        guilds.map(async (guild) => {
          // Select and delete the commands of each guild
          const commands = await this.fetchApplicationCommands(guild);
          if (commands)
            await Promise.all(
              commands.map(async (value) => {
                const guildManager = this.guilds.cache.get(guild);
                if (guildManager) guildManager.commands.delete(value);
              })
            );
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
  getApplicationCommandGroupTree(interaction: CommandInteraction) {
    const tree: string[] = [];

    const getOptionsTree = (
      option: Partial<CommandInteractionOption> | undefined
    ): void => {
      if (!option) return;

      if (
        !option.type ||
        option.type === "SUB_COMMAND_GROUP" ||
        option.type === "SUB_COMMAND"
      ) {
        if (option.name) tree.push(option.name);
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
  getApplicationCommandFromTree(tree: string[]) {
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
  async executeInteraction(interaction: Interaction) {
    if (!interaction) {
      if (!this.silent) {
        console.log("Interaction is undefined");
      }
      return;
    }

    // if interaction is a button
    if (interaction.isButton()) {
      const button = this.buttons.find((s) => s.id === interaction.customId);
      if (
        !button ||
        (button.guilds.length &&
          interaction.guild &&
          !button.guilds.includes(interaction.guild.id)) ||
        (button.botIds.length && !button.botIds.includes(this.botId))
      )
        return console.log(
          `button interaction not found, interactionID: ${interaction.id} | customID: ${interaction.customId}`
        );

      return button.execute(interaction, this);
    }

    // if interaction is a button
    if (interaction.isSelectMenu()) {
      const menu = this.selectMenus.find((s) => s.id === interaction.customId);
      if (
        !menu ||
        (menu.guilds.length &&
          interaction.guild &&
          !menu.guilds.includes(interaction.guild.id)) ||
        (menu.botIds.length && !menu.botIds.includes(this.botId))
      )
        return console.log(
          `selectMenu interaction not found, interactionID: ${interaction.id} | customID: ${interaction.customId}`
        );

      return menu.execute(interaction, this);
    }

    // if interaction is context menu
    if (interaction.isContextMenu()) {
      const applicationCommand = this.allApplicationCommands.find(
        (cmd) =>
          cmd.type !== "CHAT_INPUT" && cmd.name === interaction.commandName
      );

      if (
        !applicationCommand ||
        (applicationCommand.guilds.length &&
          interaction.guild &&
          !applicationCommand.guilds.includes(interaction.guild.id)) ||
        (applicationCommand.botIds.length &&
          !applicationCommand.botIds.includes(this.botId))
      )
        return console.log(
          `context menu interaction not found, name: ${interaction.commandName}`
        );

      if (
        applicationCommand.botIds.length &&
        !applicationCommand.botIds.includes(this.botId)
      )
        return;

      return applicationCommand.execute(interaction, this);
    }

    // If the interaction isn't a slash command, return
    if (!interaction.isCommand()) return;

    // Get the interaction group tree
    const tree = this.getApplicationCommandGroupTree(interaction);
    const applicationCommand = this.getApplicationCommandFromTree(tree);

    if (
      !applicationCommand ||
      (applicationCommand.botIds.length &&
        !applicationCommand.botIds.includes(this.botId))
    ) {
      return console.log(
        `interaction not found, commandName: ${interaction.commandName}`
      );
    }

    // Parse the options values and inject it into the @Slash method
    return applicationCommand.execute(interaction, this);
  }

  /**
   * Fetch prefix for message
   * @param message messsage instance
   * @returns
   */
  async getMessagePrefix(message: Message) {
    if (typeof this.prefix === "string") return this.prefix;
    else return await this.prefix(message);
  }

  /**
   *
   * @param prefix command prefix
   * @param message original message
   * @returns
   */
  parseCommand(
    prefix: string,
    message: Message
  ): undefined | SimpleCommandMessage {
    const escapePrefix = prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const prefixRegex = RegExp(`^${escapePrefix}`);
    const isCommand = prefixRegex.test(message.content);
    if (!isCommand) return undefined;

    const contentWithoutPrefix =
      message.content.replace(prefixRegex, "").trim() + " ";

    const commandRaw = this.allSimpleCommands.find((cmd) =>
      contentWithoutPrefix.startsWith(`${cmd.name} `)
    );

    if (!commandRaw) return undefined;

    const commandArgs = contentWithoutPrefix
      .replace(commandRaw.name, "")
      .trim();

    const command = new SimpleCommandMessage(
      prefix,
      commandRaw.name,
      commandArgs,
      message,
      commandRaw.command
    );

    return command;
  }

  /**
   * Execute the corresponding @SimpleCommand based on an message instance
   * @param message The discord.js message instance
   * @returns
   */
  async executeCommand(message: Message) {
    if (!message) {
      if (!this.silent) {
        console.log("message is undefined");
      }
      return;
    }

    const prefix = await this.getMessagePrefix(message);
    if (!prefix) {
      if (!this.silent) console.log("command prefix not found");
      return;
    }

    const command = this.parseCommand(prefix, message);
    if (!command) return;

    // validate bot id
    if (command.info.botIds.length && !command.info.botIds.includes(this.botId))
      return;

    // validate guild id
    if (
      command.info.guilds.length &&
      message.guild?.id &&
      !command.info.guilds.includes(message.guild.id)
    )
      return;

    // check dm allowed or not
    if (!command.info.directMessage && !message.guild) return;

    // check for member permissions
    if (command.info.defaultPermission) {
      // when default perm is on
      const permissions = command.info.permissions.filter(
        (perm) => !perm.permission
      );
      const userPermissions = permissions.filter(
        (perm) => perm.type === "USER"
      );
      const rolePermissions = permissions.filter(
        (perm) => perm.type === "ROLE"
      );

      const isUserIdNotAllowed =
        userPermissions.some((perm) => perm.id === message.member?.id) ||
        rolePermissions.some((perm) =>
          message.member?.roles.cache.has(perm.id)
        );

      // user is not allowed to access this command
      if (isUserIdNotAllowed) {
        if (this.unauthorizedHandler) {
          if (typeof this.unauthorizedHandler === "string") {
            message.reply(this.unauthorizedHandler);
            return;
          }
          await this.unauthorizedHandler(command);
        }
        return;
      }
    } else {
      // when default perm is off
      const permissions = command.info.permissions.filter(
        (perm) => perm.permission
      );
      const userPermissions = permissions.filter(
        (perm) => perm.type === "USER"
      );
      const rolePermissions = permissions.filter(
        (perm) => perm.type === "ROLE"
      );

      const isUserIdAllowed =
        userPermissions.some((perm) => perm.id === message.member?.id) ||
        rolePermissions.some((perm) =>
          message.member?.roles.cache.has(perm.id)
        );

      // user does not have any permission to access this command
      if (!isUserIdAllowed) {
        if (this.unauthorizedHandler) {
          if (typeof this.unauthorizedHandler === "string") {
            message.reply(this.unauthorizedHandler);
            return;
          }
          await this.unauthorizedHandler(command);
        }
        return;
      }
    }

    return command.info.execute(command, this);
  }

  /**
   * Manually trigger an event (used for tests)
   * @param event The event
   * @param params Params to inject
   * @param once Trigger an once event
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger(event: DiscordEvents, params?: any, once = false): Promise<any[]> {
    return this.decorators.trigger(event, this, once)(params);
  }

  /**
   * Manually build the app
   */
  async build() {
    await this.decorators.build();
  }
}
