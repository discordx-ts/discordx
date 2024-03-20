/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Decorator } from "@discordx/internal";

import type {
  DApplicationCommand,
  DApplicationCommandOption,
} from "../index.js";

type CreateStructure<T> = {
  name: string;
  payload: Partial<T>;
  root?: string;
};

/**
 * @category Decorator
 */
export class DApplicationCommandGroup<
  InfoType = DApplicationCommand | DApplicationCommandOption,
> extends Decorator {
  name: string;
  root?: string;
  payload: Partial<InfoType>;

  protected constructor(options: CreateStructure<InfoType>) {
    super();
    this.name = options.name;
    this.root = options.root;
    this.payload = options.payload ?? {};
  }

  static create<T = DApplicationCommand | DApplicationCommandOption>(
    options: CreateStructure<T>,
  ): DApplicationCommandGroup<T> {
    return new DApplicationCommandGroup<T>(options);
  }
}
