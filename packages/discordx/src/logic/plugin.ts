/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
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
