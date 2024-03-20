/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Decorator } from "@discordx/internal";

import { SimpleCommandOptionType } from "../../index.js";

type CreateStructure = {
  description?: string;
  name: string;
  type?: SimpleCommandOptionType;
};

/**
 * @category Decorator
 */
export class DSimpleCommandOption extends Decorator {
  private _name: string;
  private _description: string;
  private _type: SimpleCommandOptionType;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get type(): SimpleCommandOptionType {
    return this._type;
  }
  set type(value: SimpleCommandOptionType) {
    this._type = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  protected constructor(data: CreateStructure) {
    super();
    this._name = data.name;
    this._type = data.type ?? SimpleCommandOptionType.String;
    this._description =
      data.description ??
      SimpleCommandOptionType[this._type]?.toLowerCase() ??
      "";
  }

  static create(data: CreateStructure): DSimpleCommandOption {
    return new DSimpleCommandOption(data);
  }
}
