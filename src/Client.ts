import {
  Client as ClientJS,
  CommandInteraction,
  CommandInteractionOption,
  Interaction,
  Snowflake,
} from "discord.js";
import * as Glob from "glob";
import {
  MetadataStorage,
  LoadClass,
  ClientOptions,
  DiscordEvents,
  DOn,
  GuardFunction,
} from ".";
import { DDiscord, DOption, DSlash } from "./decorators";
import { GuildNotFoundError } from "./errors";

export class Client extends ClientJS {
  private _silent: boolean;
  private _loadClasses: LoadClass[] = [];
  private static _requiredByDefault = false;
  private static _slashGuilds: string[] = [];
  private static _guards: GuardFunction[] = [];

  static get slashGuilds() {
    return Client._slashGuilds;
  }
  static set slashGuilds(value) {
    Client._slashGuilds = value;
  }
  get slashGuilds() {
    return Client._slashGuilds;
  }
  set slashGuilds(value) {
    Client._slashGuilds = value;
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

  static get slashes() {
    return MetadataStorage.instance.slashes as readonly DSlash[];
  }
  get slashes() {
    return Client.slashes;
  }

  static get allSlashes() {
    return MetadataStorage.instance.allSlashes as readonly DSlash[];
  }
  get allSlashes() {
    return Client.allSlashes;
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
   * Create your bot
   * @param options { silent: boolean, loadClasses: LoadClass[] }
   */
  constructor(options?: ClientOptions) {
    super(options);

    this._silent = !!options?.silent;
    this._loadClasses = options?.classes || [];
    this.guards = options.guards || [];
    this.requiredByDefault = options.requiredByDefault;
    this.slashGuilds = options.slashGuilds || [];
  }

  /**
   * Start your bot
   * @param token The bot token
   * @param loadClasses A list of glob path or classes
   */
  async login(token: string, ...loadClasses: LoadClass[]) {
    if (loadClasses.length > 0) {
      this._loadClasses = loadClasses;
    }

    await this.build();

    if (!this.silent) {
      console.log("Events");
      if (this.events.length > 0) {
        this.events.map((event) => {
          const eventName = event.event;
          console.log(`   ${eventName} (${event.classRef.name}.${event.key})`);
        });
      } else {
        console.log("   No events detected");
      }

      console.log("");

      console.log("Slashes");
      if (this.slashes.length > 0) {
        this.slashes.map((slash) => {
          console.log(`   ${slash.name} (${slash.classRef.name}.${slash.key})`);
          const printOptions = (options: DOption[], depth: number) => {
            if (!options) return;
    
            const tab = Array(depth).join("      ");
  
            options.forEach((option) => {
              console.log(`${tab}${option.name}: ${option.stringType} (${option.classRef.name}.${option.key})`);
              printOptions(option.options, depth + 1);
            });
          };
  
          printOptions(slash.options, 2);
  
          console.log("");
        });
      } else {
        console.log("   No slashes detected");
      }
    }

    this.decorators.usedEvents.map(async (on) => {
      if (on.once) {
        this.once(
          on.event as any,
          this.decorators.trigger(on.event, this, true)
        );
      } else {
        this.on(
          on.event as any,
          this.decorators.trigger(on.event, this)
        );
      }
    });

    return super.login(token);
  }

  /**
   * Initialize all the @Slash with their permissions
   */
  async initSlashes() {
    await Promise.all(
      this.slashes.map(async (slash) => {
        // Init all the @Slash
        if (slash.guilds.length > 0) {
          // If the @Slash is guild specific, add it to the guild
          await Promise.all(
            slash.guilds.map(async (guildID) => {
              const guild = this.guilds.cache.get(guildID as Snowflake);

              if (!guild) {
                throw new GuildNotFoundError(guildID);
              }

              const commands = guild.commands;
              const command = await commands.create(slash.toObject());

              if (slash.permissions.length <= 0) return;

              // https://discord.js.org/#/docs/main/master/class/ApplicationCommandPermissionsManager?scrollTo=set
              await commands.permissions.set({
                command: command,
                permissions: slash.getPermissions(),
              });
            })
          );
        } else {
          // If the @Slash is global, add it globaly
          const commands = this.application.commands;
          await commands.create(slash.toObject());

          // Only available for Guilds
          // https://discord.js.org/#/docs/main/master/class/ApplicationCommand?scrollTo=setPermissions
          // if (slash.permissions.length <= 0) return;

          // await commands.setPermissions(command, slash.getPermissions());
        }
      })
    );
  }

  /**
   * Fetch the existing slash commands of a guild or globaly
   * @param guild The guild ID (empty -> globaly)
   * @returns The existing commands
   */
  async fetchSlash(guildID?: string) {
    if (guildID) {
      const guild = this.guilds.cache.get(guildID as Snowflake);
      if (!guild) {
        throw new GuildNotFoundError(guildID);
      }
      return await guild.commands.fetch();
    }
    return await this.application.commands.fetch();
  }

  /**
   * Clear the Slash commands globaly or for some guilds
   * @param guilds The guild IDs (empty -> globaly)
   */
  async clearSlashes(...guilds: string[]) {
    if (guilds.length > 0) {
      await Promise.all(
        guilds.map(async (guild) => {
          // Select and delete the commands of each guild
          const commands = await this.fetchSlash(guild);
          await Promise.all(
            commands.map(async (value) => {
              await this.guilds.cache.get(guild as Snowflake).commands.delete(value);
            })
          );
        })
      );
    } else {
      // Select and delete the commands of each guild
      const commands = await this.fetchSlash();
      await Promise.all(
        commands.map(async (value) => {
          await this.application.commands.delete(value);
        })
      );
    }
  }

  /**
   * Get the group tree of an interaction 
   * /hello => ["hello"]
   * /test hello => ["test", "hello"]
   * /test hello me => ["test", "hello", "me"]
   * @param interaction The targeted interaction
   * @returns The group tree
   */
  getInteractionGroupTree(interaction: CommandInteraction) {
    const tree = [];

    const getOptionsTree = (
      option: Partial<CommandInteractionOption>
    ) => {
      if (!option) return;

      if (
        !option.type || 
        option.type === "SUB_COMMAND_GROUP" ||
        option.type === "SUB_COMMAND"
      ) {
        tree.push(option.name);
        return getOptionsTree(Array.from(option.options?.values() || [])?.[0]);
      }
    };

    getOptionsTree({
      name: interaction.commandName,
      options: interaction.options,
      type: undefined
    });

    return tree;
  }

  /**
   * Return the corresponding @Slash from a tree
   * @param tree 
   * @returns The corresponding Slash
   */
  getSlashFromTree(tree: string[]) {
    // Find the corresponding @Slash
    return this.allSlashes.find((slash) => {
      switch(tree.length) {
        case 1:
          // Simple command /hello
          return (
            slash.group === undefined &&
            slash.subgroup === undefined &&
            slash.name === tree[0]
          );
        case 2:
          // Simple grouped command
          // /permission user perm
          return (
            slash.group === tree[0] &&
            slash.subgroup === undefined &&
            slash.name === tree[1]
          );
        case 3:
          // Grouped and subgroupped command
          // /permission user perm
          return (
            slash.group === tree[0] &&
            slash.subgroup === tree[1] &&
            slash.name === tree[2]
          );
      }
    });
  }

  /**
   * Execute the corresponding @Slash command based on an Interaction instance
   * @param interaction The discord.js interaction instance
   * @returns void
   */
  async executeSlash(interaction: Interaction) {
    if (!interaction) {
      if (!this.silent) {
        console.log("Interaction is undefined");
      }
      return;
    }

    // If the interaction isn't a slash command, return
    if (!interaction.isCommand()) return;

    // Get the interaction group tree
    const tree = this.getInteractionGroupTree(interaction);
    const slash = this.getSlashFromTree(tree);

    if (!slash) return;

    // Parse the options values and inject it into the @Slash method
    return slash.execute(interaction, this);
  }

  /**
   * Manually build the app
   */
  async build() {
    this.loadClasses();
    await this.decorators.build();
  }

  /**
   * Manually trigger an event (used for tests)
   * @param event The event
   * @param params Params to inject
   * @param once Trigger an once event
   */
  trigger(
    event: DiscordEvents,
    params?: any,
    once = false
  ): Promise<any[]> {
    return this.decorators.trigger(event, this, once)(params);
  }

  private loadClasses() {
    if (!this._loadClasses) {
      return;
    }

    this._loadClasses.forEach((file) => {
      if (typeof file === "string") {
        const files = Glob.sync(file);
        files.forEach((file) => {
          require(file);
        });
      }
    });
  }
}
