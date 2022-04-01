import { Decorator } from "@discordx/internal";
import type { ApplicationCommandOptionChoice } from "discord.js";

import type { SlashChoiceType } from "../../types/index.js";

/**
 * @category Decorator
 */
export class DApplicationCommandOptionChoice extends Decorator {
  private _name: string;
  private _value: string | number;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get value(): string | number {
    return this._value;
  }
  set value(value: string | number) {
    this._value = value;
  }

  protected constructor(name: string, value: string | number) {
    super();
    this._name = name;
    this._value = value;
  }

  static create(data: SlashChoiceType): DApplicationCommandOptionChoice {
    return new DApplicationCommandOptionChoice(
      data.name,
      data.value ?? data.name
    );
  }

  toJSON(): ApplicationCommandOptionChoice {
    return {
      name: this.name,
      value: this.value,
    };
  }
}
