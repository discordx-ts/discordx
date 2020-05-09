import { Client as ClientJS } from "discord.js";
import * as Glob from "glob";
import {
  MetadataStorage,
  LoadClass,
  DiscordParams,
  CommandParams,
  ClientOptions,
  DiscordEvents
} from ".";

export class Client extends ClientJS {
  private _silent: boolean;
  private _payloadInjection: "spread" | "first";
  private _loadClasses: LoadClass[] = [];
  private _loadedOnEvents: string[] = [];
  private _loadedOnceEvents: string[] = [];

  get silent() {
    return this._silent;
  }
  set silent(value: boolean) {
    this._silent = value;
  }

  get payloadInjection() {
    return this._payloadInjection;
  }
  set payloadInjection(value: "spread" | "first") {
    this._payloadInjection = value;
  }

  constructor(options?: ClientOptions) {
    super(options);
    this._payloadInjection = "first";
    this._silent = false;
    this._loadClasses = [];

    if (options) {
      this.silent = options.silent;
      this.payloadInjection = options.payloadInjection || "first";
      this._loadClasses = options.classes;
    }
  }

  static setDiscordParams(discordInstance: InstanceType<any>, params: DiscordParams): boolean {
    return MetadataStorage.instance.setDiscordParams(discordInstance, params);
  }

  static setCommandParams(discordInstance: InstanceType<any>, instanceMethod: Function, params: CommandParams): boolean {
    return MetadataStorage.instance.setCommandParams(discordInstance, instanceMethod, params);
  }

  static getCommandsIntrospection(forPrefix?: string) {
    return MetadataStorage.instance.getCommandsIntrospection(forPrefix);
  }

  static getCommands<InfoType = any>(forPrefix?: string) {
    return MetadataStorage.instance.getCommands<InfoType>(forPrefix);
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

    MetadataStorage.instance.ons.map(async (on) => {
      if (
        on.params.once &&
        this._loadedOnceEvents.indexOf(on.params.event) === -1
      ) {
        this.once(
          on.params.event,
          MetadataStorage.instance.compileOnForEvent(
            on.params.event,
            this,
            true
          )
        );
        this._loadedOnceEvents.push(on.params.event);
      } else if (this._loadedOnEvents.indexOf(on.params.event) === -1) {
        this.on(
          on.params.event,
          MetadataStorage.instance.compileOnForEvent(
            on.params.event,
            this
          )
        );
        this._loadedOnEvents.push(on.params.event);
      }

      if (!this.silent) {
        let eventName = on.params.event;
        if (on.params.commandName !== undefined) {
          const prefix = MetadataStorage.instance.getPrefix(on.params);
          if (prefix) {
            let commandName = on.params.commandName;
            if (!on.params.commandCaseSensitive && !on.params.linkedInstance.params.commandCaseSensitive) {
              commandName = commandName.toLowerCase();
            }
            if (on.params.commandName === "") {
              eventName += ` (Command not found "${prefix}")`;
            } else {
              eventName += ` (Command "${prefix}${on.params.commandName}")`;
            }
          }
        }
        console.log(`${eventName}: ${on.params.from.name}.${on.key}`);
      }
    });

    return super.login(token);
  }

  build() {
    this.loadClasses();
    MetadataStorage.instance.build(this);
  }

  trigger (event: DiscordEvents, ...params: any): Promise<any[]> {
    return MetadataStorage.instance.compileOnForEvent(
      event,
      this
    )(...params);
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
