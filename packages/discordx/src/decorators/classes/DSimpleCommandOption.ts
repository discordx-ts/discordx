import { Decorator } from "@discordx/internal";

import { SimpleCommandOptionType } from "../../index.js";

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

  protected constructor(
    name: string,
    type?: SimpleCommandOptionType,
    description?: string
  ) {
    super();
    this._name = name;
    this._description =
      description ??
      `${
        SimpleCommandOptionType[type ?? SimpleCommandOptionType.String]
      }`.toLowerCase();
    this._type = type ?? SimpleCommandOptionType.String;
  }

  static create(
    name: string,
    type?: SimpleCommandOptionType,
    description?: string
  ): DSimpleCommandOption {
    return new DSimpleCommandOption(name, type, description);
  }
}
