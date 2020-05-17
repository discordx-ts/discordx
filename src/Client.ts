import { Client as ClientJS } from "discord.js";
import * as Glob from "glob";
import {
  MetadataStorage,
  LoadClass,
  ClientOptions,
  DiscordEvents,
  CommandInfos,
  InfosType,
  ArgsRulesFunction,
  RuleBuilder,
  CommandNotFoundInfos,
  EventInfos,
  DiscordInfos
} from ".";

export class Client extends ClientJS {
  private _silent: boolean;
  private _loadClasses: LoadClass[] = [];

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
    this._silent = false;
    this._loadClasses = [];

    if (options) {
      this.silent = options.silent;
      this._loadClasses = options.classes;
    }
  }

  /**
   * Get the details about the created commands of your app (@Command)
   */
  static getCommands<Type extends InfosType = any>(): CommandInfos<Type>[] {
    return MetadataStorage.instance.commands.map<CommandInfos<Type>>((c) => {
      return {
        argsRules: c.argsRules as any as ArgsRulesFunction<RuleBuilder>[],
        infos: c.infos as InfosType<Type>,
        commandName: c.commandName,
        prefix: c.linkedDiscord.prefix,
        description: c.infos.description
      };
    });
  }

  /**
   * Get the details about the created events of your app (@On)
   */
  static getEvent(): EventInfos[] {
    return MetadataStorage.instance.events.map<EventInfos>((event) => {
      return {
        event: event.event,
        once: event.once,
        linkedInstance: event.linkedDiscord
      };
    });
  }

  /**
   * Get the details about the created discords of your app (@Discord)
   */
  static getDiscords<Type extends InfosType = any>(): DiscordInfos<Type>[] {
    return MetadataStorage.instance.discords.map<DiscordInfos<Type>>((discord) => {
      return {
        argsRules: discord.argsRules as ArgsRulesFunction<RuleBuilder>[],
        infos: discord.infos as InfosType<Type>,
        prefix: discord.prefix,
        commandNotFound: discord.commandNotFound,
        description: discord.infos.description
      };
    });
  }

  /**
   * Get the details about the created commandsNotFound of your app (@CommandNotFound)
   */
  static getCommandsNotFound<Type extends InfosType = any>(): CommandNotFoundInfos<Type>[] {
    return MetadataStorage.instance.commandsNotFound.map<CommandNotFoundInfos<Type>>((c) => {
      return {
        infos: c.infos as InfosType<Type>,
        prefix: c.linkedDiscord.prefix,
        description: c.infos.description
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

    MetadataStorage.instance.events.map(async (on) => {
      if (on.once) {
        this.once(
          on.event,
          MetadataStorage.instance.trigger(
            on.event,
            this,
            true
          )
        );
      } else {
        this.on(
          on.event,
          MetadataStorage.instance.trigger(
            on.event,
            this
          )
        );
      }

      if (!this.silent) {
        let eventName = on.event;
        console.log(`${eventName}: ${on.classRef.name}.${on.key}`);
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
  trigger (event: DiscordEvents, params: any, once: boolean = false): Promise<any[]> {
    return MetadataStorage.instance.trigger(
      event,
      this,
      once
    )(params);
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
