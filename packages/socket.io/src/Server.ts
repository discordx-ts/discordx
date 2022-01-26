import { DIService } from "@discordx/di";
import { Server as ServerClient } from "socket.io";

import type { GuardFunction } from "./index.js";
import { MetadataStorage } from "./logic/metadata.js";

export class Server extends ServerClient {
  // getters
  private _appId = "socket";
  private _guards: GuardFunction[] = [];

  get appId(): string {
    return this._appId;
  }
  set appId(value: string) {
    this._appId = value;
  }

  get guards(): GuardFunction[] {
    return this._guards;
  }
  set guards(value: GuardFunction[]) {
    this._guards = value;
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
