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
  private _loadClasses: LoadClass[] = [];

  get silent() {
    return this._silent;
  }
  set silent(value: boolean) {
    this._silent = value;
  }

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

  build() {
    this.loadClasses();
    MetadataStorage.instance.build(this);
  }

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
