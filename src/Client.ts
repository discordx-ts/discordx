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
  private static _requiredByDefault = false;
  private static _botGuilds: Snowflake[] = [];
  private static _guards: GuardFunction[] = [];

  static get botGuilds() {
    return Client._botGuilds;
  }
  static set botGuilds(value) {
    Client._botGuilds = value;
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

  get botGuilds() {
    return Client._botGuilds;
  }
  set botGuilds(value) {
    Client._botGuilds = value;
  }

  static get requiredByDefault() {
    return Client._requiredByDefault;
  }
  static set requiredByDefault(value) {
    Client._requiredByDefault = value;
  }
  get requiredByDefault() {
    return Client._requiredByDefault;
  }
  set requiredByDefault(value) {
    Client._requiredByDefault = value;
  }

  static get guards() {
    return Client._guards;
  }
  static set guards(value) {
    Client._guards = value;
  }
  get guards() {
    return Client.guards;
  }
  set guards(value) {
    Client._guards = value;
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
    this.requiredByDefault = options.requiredByDefault ?? false;
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
   * @deprecated Use `initApplicationCommands` instead. will be removed by end of auguest 2021.
   */
  initSlashes = this.initApplicationCommands;

  /**
   * Initialize all the @Slash with their permissions
   */
  async initApplicationCommands(options?: {
    log: { forGuild: boolean; forGlobal: boolean };
  }) {
    // # group guild slashes by guildId
    const guildSlashStorage = new Map<Snowflake, DApplicationCommand[]>();
    const guildsSlash = this.applicationCommands.filter(
      (s) => s.guilds?.length
    );

    // group single guild slashes together
    guildsSlash.forEach((s) => {
      s.guilds.forEach((guild) =>
        guildSlashStorage.set(guild, [
          ...(guildSlashStorage.get(guild) ?? []),
          s,
        ])
      );
    });

    // run task to add/update/delete slashes for guilds
    guildSlashStorage.forEach(async (slashes, key) => {
      const guild = await this.guilds.fetch({ guild: key });
      if (!guild) return console.log(`${key} guild not found`);

      // fetch already registered command
      const existing = await guild.commands.fetch();

      // filter only unregistered command
      const added = slashes.filter(
        (s) =>
          !existing.find((c) => c.name === s.name) &&
          (!s.botIds.length || s.botIds.includes(this.botId))
      );

      // filter slashes to update
      const updated = slashes
        .map<[ApplicationCommand | undefined, DApplicationCommand]>((s) => [
          existing.find(
            (c) =>
              c.name === s.name &&
              (!s.botIds.length || s.botIds.includes(this.botId))
          ),
          s,
        ])
        .filter<[ApplicationCommand, DApplicationCommand]>(
          (s): s is [ApplicationCommand, DApplicationCommand] =>
            s[0] !== undefined
        );

      // filter slashes to delete
      const deleted = existing.filter(
        (s) =>
          !this.applicationCommands.find(
            (bs) =>
              s.name === bs.name &&
              s.guild &&
              bs.guilds.includes(s.guild.id) &&
              (!bs.botIds.length || bs.botIds.includes(this.botId))
          )
      );

      // log the changes to slashes in console if enabled by options or silent mode is turned off
      if (options?.log.forGuild || !this.silent) {
        console.log(
          `${this.user?.username} >> guild: #${guild} >> command >> adding ${
            added.length
          } [${added.map((s) => s.name).join(", ")}]`
        );

        console.log(
          `${this.user?.username} >> guild: #${guild} >> command >> deleting ${
            deleted.size
          } [${deleted.map((s) => s.name).join(", ")}]`
        );

        console.log(
          `${this.user?.username} >> guild: #${guild} >> command >> updating ${updated.length}`
        );
      }

      await Promise.all([
        // add and set permissions
        ...added.map((s) =>
          guild.commands.create(s.toObject()).then((cmd) => {
            if (s.permissions.length) {
              cmd.permissions.set({ permissions: s.permissions });
            }
            return cmd;
          })
        ),

        // update and set permissions
        ...updated.map((s) =>
          s[0].edit(s[1].toObject()).then((cmd) => {
            if (s[1].permissions.length) {
              cmd.permissions.set({ permissions: s[1].permissions });
            }
            return cmd;
          })
        ),

        // delete
        ...deleted.map((key) => guild.commands.delete(key)),
      ]);
    });

    // # initialize add/update/delete task for global slashes
    const existing = (await this.fetchApplicationCommands())?.filter(
      (s) => !s.guild
    );
    const slashes = this.applicationCommands.filter((s) => !s.guilds?.length);
    if (existing) {
      const added = slashes.filter(
        (s) => !existing.find((c) => c.name === s.name)
      );

      const updated = slashes
        .map<[ApplicationCommand | undefined, DApplicationCommand]>((s) => [
          existing.find((c) => c.name === s.name),
          s,
        ])
        .filter<[ApplicationCommand, DApplicationCommand]>(
          (s): s is [ApplicationCommand, DApplicationCommand] =>
            s[0] !== undefined
        );

      const deleted = existing.filter((c) =>
        slashes.every((s) => s.name !== c.name)
      );

      // log the changes to slashes in console if enabled by options or silent mode is turned off
      if (options?.log.forGlobal || !this.silent) {
        console.log(
          `${this.user?.username} >> global >> command >> adding ${
            added.length
          } [${added.map((s) => s.name).join(", ")}]`
        );
        console.log(
          `${this.user?.username} >> global >> command >> deleting ${
            deleted.size
          } [${deleted.map((s) => s.name).join(", ")}]`
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
        ...added.map((s) => this.application?.commands.create(s.toObject())),
        // update
        ...updated.map((s) => s[0].edit(s[1].toObject())),
        // delete
        ...deleted.map((key) => this.application?.commands.delete(key)),
      ]);
    }
  }

  /**
   * @deprecated Use `fetchApplicationCommands` instead. will be removed by end of auguest 2021.
   */
  fetchSlash = this.fetchApplicationCommands;

  /**
   * Fetch the existing slash commands of a guild or globaly
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
   * @deprecated Use `clearApplicationCommands` instead. will be removed by end of auguest 2021.
   */
  clearSlashes = this.clearApplicationCommands;

  /**
   * Clear the Slash commands globaly or for some guilds
   * @param guilds The guild IDs (empty -> globaly)
   */
  async clearApplicationCommands(...guilds: Snowflake[]) {
    if (guilds.length) {
      await Promise.all(
        guilds.map(async (guild) => {
          // Select and delete the commands of each guild
          const commands = await this.fetchApplicationCommands(guild);
          if (commands && this.guilds.cache !== undefined)
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
          commands.map(async (value) => {
            await this.application?.commands.delete(value);
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
