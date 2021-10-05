/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DApplicationCommandOptionChoice, SlashOptionType } from "../..";
import { ApplicationCommandOptionData } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
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
  private _channelTypes: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[] = [];
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

  get channelTypes() {
    return this._channelTypes;
  }
  set channelTypes(value) {
    this._channelTypes = value;
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
    channelType?: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[],
    index?: number
  ) {
    super();

    this._name = name;
    this._type = type ?? "STRING";
    this._description = description ?? `${name} - ${this.type}`;
    this._required = required ?? false;
    this._channelTypes = channelType ?? [];
    this._index = index;
  }

  static create(
    name: string,
    type?: SlashOptionType,
    description?: string,
    required?: boolean,
    channelType?: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[],
    index?: number
  ) {
    return new DApplicationCommandOption(
      name,
      type,
      description,
      required,
      channelType,
      index
    );
  }

  toJSON(): ApplicationCommandOptionData {
    const options = [...this.options]
      .reverse()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((option) => option.toJSON() as any);

    const data: ApplicationCommandOptionData = {
      channelTypes:
        this.channelTypes.length === 0 ? undefined : this.channelTypes,
      choices:
        this.choices.length === 0
          ? undefined
          : this.choices.map((choice) => choice.toJSON()),
      description: this.description,
      name: this.name,
      options: options.length === 0 ? undefined : options,
      required: !this.isNode ? undefined : this.required,
      type: this.type,
    };

    return data;
  }
}
