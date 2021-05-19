import { ApplicationCommandOptionChoice } from "discord.js";
import { Decorator } from "../classes/Decorator";

export class DChoice<Type = any> extends Decorator {
  private _name: string;
  private _value: Type;

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

  static create<Type = any>(name: string, value: Type) {
    const choice = new DChoice<Type>();

    choice.name = name;
    choice.value = value;

    return choice;
  }

  toObject(): ApplicationCommandOptionChoice {
    return {
      name: this.name,
      value: this.value as any,
    };
  }
}
