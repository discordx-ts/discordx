import { Client as ClientJS, ClientEvents } from "discord.js";
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
} from ".";
import { GuardFunction } from "./types";

export class Client extends ClientJS {
  private _silent: boolean;
  private _loadClasses: LoadClass[] = [];
  private static _guards: DGuard[] = [];

  get silent() {
    return this._silent;
  }
  set silent(value: boolean) {
    this._silent = value;
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
