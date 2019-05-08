import { Client } from "discord.js";
import * as Glob from "glob";
import {
  MetadataStorage,
  LoadFile
} from ".";

export class DiscordTS {
  private _client: Client;
  private _loadFiles: LoadFile[] = [];

  constructor(client: Client, ...loadFiles: LoadFile[]) {
    this._client = client;
    this._loadFiles = loadFiles;
  }

  get Client() {
    return this._client;
  }

  Start(silent: boolean = false) {
    this.loadFiles();
    MetadataStorage.Instance.Ons.map((on) => {
      this._client.on(on.params.event, (...params: any[]) => {
        on.params.method.bind(on.class)(...params, this._client);
      });
      if (!silent) {
        console.log(`${on.params.event}: ${on.class.constructor.name}.${on.key}`);
      }
    });
    return this;
  }

  private loadFiles() {
    if (this._loadFiles) {
      this._loadFiles.map((file) => {
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
