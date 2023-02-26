import type { Client } from "../index.js";
import type { Awaitable } from "../types/index.js";
import { MetadataStorage } from "./metadata/MetadataStorage.js";

export interface PluginConfiguration {
  metadata: MetadataStorage;
}

export abstract class Plugin {
  constructor(options: PluginConfiguration) {
    MetadataStorage.instance = options.metadata;
  }

  abstract init(client: Client): Awaitable<void>;
}
