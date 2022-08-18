import { Decorator } from "@discordx/internal";
import type { LocalizationMap } from "discord.js";

import type {
  ApplicationCommandOptionChoiceDataEx,
  SlashChoiceType,
} from "../../types/index.js";

/**
 * @category Decorator
 */
export class DApplicationCommandOptionChoice extends Decorator {
  private _name: string;
  private _nameLocalizations: LocalizationMap | null;
  private _value: string | number;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get nameLocalizations(): LocalizationMap | null {
    return this._nameLocalizations;
  }
  set nameLocalizations(value: LocalizationMap | null) {
    this._nameLocalizations = value;
  }

  get value(): string | number {
    return this._value;
  }
  set value(value: string | number) {
    this._value = value;
  }

  protected constructor(data: SlashChoiceType) {
    super();
    this._name = data.name;
    this._nameLocalizations = data.nameLocalizations ?? null;
    this._value = data.value ?? data.name;
  }

  static create(data: SlashChoiceType): DApplicationCommandOptionChoice {
    return new DApplicationCommandOptionChoice(data);
  }

  toJSON(): ApplicationCommandOptionChoiceDataEx {
    return {
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      value: this.value,
    };
  }
}
