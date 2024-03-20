/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ApplicationCommand } from "discord.js";

import type { DApplicationCommand } from "../../index.js";

export class ApplicationCommandMixin {
  constructor(
    public command: ApplicationCommand,
    public instance: DApplicationCommand,
  ) {
    // empty constructor
  }

  get name(): string {
    return this.command.name;
  }

  get description(): string {
    return this.command.description;
  }
}
