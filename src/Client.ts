import { Client as ClientJS } from "discord.js";
import * as Glob from "glob";
import {
  MetadataStorage,
  LoadClass
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

  login(token: string, ...loadClasses: LoadClass[]) {
    this._loadClasses = loadClasses;
    this.loadClasses();

    MetadataStorage.Instance.Build();
    MetadataStorage.Instance.Ons.map(async (on) => {
      const fn = async (...params: any[]) => {
        const execute = await on.params.guardFn(this, ...params);

        if (execute) {
          if (on.params.linkedInstance && on.params.linkedInstance.instance) {
            on.params.method.bind(on.params.linkedInstance.instance)(...params, this);
          } else {
            on.params.method(...params, this);
          }
        }
      };

      if (on.params.once) {
        this.once(on.params.event, fn);
      } else {
        this.on(on.params.event, fn);
      }

      if (!this.silent) {
        console.log(`${on.params.event}: ${on.class.name}.${on.key}`);
      }
    });

    return super.login(token);
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
