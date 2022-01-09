import { DIService } from "@discordx/di";
import KoaClient from "koa";
import { MetadataStorage } from "./logic/metadata.js";

export class Koa extends KoaClient {
  // getters
  private _api = "api";

  get api(): string {
    return this._api;
  }
  set api(value: string) {
    this._api = value;
  }

  get di(): DIService {
    return DIService.instance;
  }

  get instance(): MetadataStorage {
    return MetadataStorage.instance;
  }

  build(): Promise<void> {
    return MetadataStorage.instance.build(this);
  }
}
