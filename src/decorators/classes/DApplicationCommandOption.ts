/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DApplicationCommandOptionChoice, SlashOptionType } from "../..";
import { ApplicationCommandOptionData } from "discord.js";
import { Decorator } from "./Decorator";

/**
 * @category Decorator
 */
export class DApplicationCommandOption extends Decorator {
  private _required = false;
  private _name: string;
  private _description: string;
  private _type: SlashOptionType;
  private _choices: DApplicationCommandOptionChoice[] = [];
  private _options: DApplicationCommandOption[] = [];
  private _isNode = false;

  get isNode() {
    return this._isNode;
  }
  set isNode(value) {
    this._isNode = value;
  }

  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }

  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }

  get required() {
    return this._required;
  }
  set required(value) {
    this._required = value;
  }

  get choices() {
    return this._choices;
  }
  set choices(value) {
    this._choices = value;
  }
  protected constructor(
    name: string,
    type?: SlashOptionType,
    description?: string,
    required?: boolean,
    index?: number
  ) {
    super();

    this._name = name.toLowerCase();
    this._type = type ?? "STRING";
    this._description = description ?? `${name} - ${this.type}`;
    this._required = required ?? false;
    this._index = index;
  }

  static create(
    name: string,
    type?: SlashOptionType,
    description?: string,
    required?: boolean,
    index?: number
  ) {
    return new DApplicationCommandOption(
      name,
      type,
      description,
      required,
      index
    );
  }

  toObject(): ApplicationCommandOptionData {
    const data: ApplicationCommandOptionData = {
      choices: this.choices.map((choice) => choice.toObject()),
      description: this.description,
      name: this.name,
      options: [...this.options]
        .reverse()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((option) => option.toObject()) as any,
      required: this.required,
      type: this.type,
    };

    if (!this.isNode) {
      delete data.required;
    }

    return data;
  }
}
