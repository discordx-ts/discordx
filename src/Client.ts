import { Client as ClientJS, GuildApplicationCommandManager, Interaction } from "discord.js";
import * as Glob from "glob";
import {
  MetadataStorage,
  LoadClass,
  ClientOptions,
  DiscordEvents,
  CommandInfos,
  InfosType,
  CommandNotFoundInfos,
  EventInfos,
  DiscordInfos,
  DOn,
  DGuard,
  GuardFunction
} from ".";
import { DSlash } from "./decorators";

export class Client extends ClientJS {
  private _silent: boolean;
  private _loadClasses: LoadClass[] = [];
  private static _requiredByDefault: boolean = false;
  private static _slashGuilds: string[] = [];
  private static _guards: DGuard[] = [];

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

  get silent() {
    return this._silent;
  }
  set silent(value: boolean) {
    this._silent = value;
  }

  static get slashes() {
    return MetadataStorage.instance.slashes as readonly DSlash[];
  }
  get slashes() {
    return MetadataStorage.instance.slashes as readonly DSlash[];
  }

  /**
   * The global guards
   */
  static get guards() {
    return Client._guards;
  }

  /**
   * Set the guards
   * @param value The guards functions
   * @returns The guards instances
   */
  static setGuards(...value: GuardFunction[]) {
    Client._guards = value.map((guard) => DGuard.createGuard(guard));
    return Client._guards;
  }

  /**
   * The global guards
   */
  get guards() {
    return Client.guards;
  }

  /**
   * Set the guards
   * @param value The guards functions
   * @returns The guards instances
   */
  setGuards(...value: GuardFunction[]) {
    return Client.setGuards(...value);
  }

  /**
   * Create your bot
   * @param options { silent: boolean, loadClasses: LoadClass[] }
   */
  constructor(options?: ClientOptions) {
    super(options);

    this._silent = options?.silent !== undefined || false;
    this._loadClasses = options?.classes || [];
    this.setGuards(...options.guards || []);
    this.requiredByDefault = options.requiredByDefault;
    this.slashGuilds = options.slashGuilds || [];
  }

  /**
   * Get the details about the created commands of your app (@Command)
   */
  static getCommands<Type extends InfosType = any>(): CommandInfos<Type>[] {
    return MetadataStorage.instance.commands.map<CommandInfos<Type>>(
      (c) => c.commandInfos
    );
  }

  /**
   * Get the details about the created events of your app (@On)
   */
  static getEvent(): EventInfos[] {
    return MetadataStorage.instance.events.map<EventInfos>((event) => {
      return {
        event: event.event,
        once: event.once,
        linkedInstance: event.linkedDiscord,
      };
    });
  }

  /**
   * Get the details about the created discords of your app (@Discord)
   */
  static getDiscords<Type extends InfosType = any>(): DiscordInfos<Type>[] {
    return MetadataStorage.instance.discords.map<DiscordInfos<Type>>(
      (d) => d.discordInfos
    );
  }

  /**
   * Get the details about the created commandsNotFound of your app (@CommandNotFound)
   */
  static getCommandsNotFound<
    Type extends InfosType = any
  >(): CommandNotFoundInfos<Type>[] {
    return MetadataStorage.instance.commandsNotFound.map<
      CommandNotFoundInfos<Type>
    >((c) => {
      return {
        infos: c.infos as InfosType<Type>,
        prefix: c.linkedDiscord.prefix,
        description: c.infos.description,
      };
    });
  }

  /**
   * Start your bot
   * @param token The bot token
   * @param loadClasses A list of glob path or classes
   */
  login(token: string, ...loadClasses: LoadClass[]) {
    if (loadClasses.length > 0) {
      this._loadClasses = loadClasses;
    }

    this.build();

    MetadataStorage.instance.events.map((event) => {
      if (!this.silent) {
        const eventName = event.event;
        console.log(`${eventName}: ${event.classRef.name}.${event.key}`);
      }
    });

    const usedEvents = MetadataStorage.instance.events.reduce<DOn[]>(
      (prev, event, index) => {
        const found = MetadataStorage.instance.events.find(
          (event2) => event.event === event2.event
        );
        const foundIndex = MetadataStorage.instance.events.indexOf(found);
        if (foundIndex === index || found.once !== event.once) {
          prev.push(event);
        }
        return prev;
      },
      []
    );

    usedEvents.map(async (on) => {
      if (on.once) {
        this.once(
          on.event as any,
          MetadataStorage.instance.trigger(on.event, this, true)
        );
      } else {
        this.on(
          on.event as any,
          MetadataStorage.instance.trigger(on.event, this)
        );
      }
    });

    return super.login(token);
  }

  async initSlashes() {
    await Promise.all(
      this.slashes.map(async (slash) => {
        if (slash.guilds.length > 0) {
          await Promise.all(
            slash.guilds.map(async (guild) => {
              const commands = this.guilds.cache.get(guild).commands;
              const command = await commands.create(slash.toObject());

              if (slash.permissions.length <= 0) return;

              await commands.setPermissions(command, slash.getPermissions());
            })
          );
        } else {
          const commands = this.application.commands;
          const command = await commands.create(slash.toObject());

          if (slash.permissions.length <= 0) return;

          await commands.setPermissions(command, slash.getPermissions());
        }
      })
    );
  }

  async clearSlashes(...guilds: string[]) {
    if (guilds.length > 0) {
      await Promise.all(
        guilds.map(async (guild) => {
          const commands = await this.guilds.cache.get(guild).commands.fetch();

          await Promise.all(commands.map(async (value) => {
            await this.guilds.cache.get(guild).commands.delete(value);
          }));
        })
      );
    } else {
      const commands = await this.application.commands.fetch();
      
      await Promise.all(commands.map(async (value) => {
        await this.application.commands.delete(value);
      }));
    }
  }

  executeSlash(interaction: Interaction) {
    // If the interaction isn't a slash command, return
    if (!interaction.isCommand()) return;

    const command = MetadataStorage.instance.slashes.find((slash) => {
      return slash.name === interaction.commandName;
    });

    if (!command) return;

    const options = interaction.options.map((option) => option.value);

    command.method(...options, interaction, this);
  }

  /**
   * Manually build the app
   */
  async build() {
    this.loadClasses();
    await MetadataStorage.instance.build();
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
    once: boolean = false
  ): Promise<any[]> {
    return MetadataStorage.instance.trigger(event, this, once)(params);
  }

  private loadClasses() {
    if (this._loadClasses) {
      this._loadClasses.map((file) => {
        if (typeof file === "string") {
          const files = Glob.sync(file);
          files.map((file) => {
            require(file);
          });
        }
      });
    }
  }
}
