import { ApplicationCommandOptionChoice } from "discord.js";
import { Decorator } from "../classes/Decorator";

export class DChoice extends Decorator {
  private _name!: string;
  private _value!: string | number;

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }

  protected constructor() {
    super();
  }

  static create(name: string, value: string | number) {
    const choice = new DChoice();

    choice.name = name;
    choice.value = value;

    return choice;
  }

  toObject(): ApplicationCommandOptionChoice {
    return {
      name: this.name,
      value: this.value,
    };
  }
}
