import {
  ApplicationCommandOptionData,
  ClientUser,
  Role,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { Decorator } from "../classes/Decorator";
import { DChoice, Client, OptionValueType, StringOptionType, OptionType } from "../..";

export class DOption extends Decorator {
  private _required: boolean = false;
  private _name: string;
  private _type: OptionValueType;
  private _description: string;
  private _choices: DChoice[] = [];
  private _options: DOption[] = [];
  private _isNode: boolean = false;

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

  get stringType(): StringOptionType {
    if (typeof this.type === "string") {
      return this.type;
    }

    switch (this.type) {
      case String:
        return OptionType.STRING;
      case Number:
        return OptionType.INTEGER;
      case Boolean:
        return OptionType.BOOLEAN;
      case TextChannel:
        return OptionType.CHANNEL;
      case VoiceChannel:
        return OptionType.CHANNEL;
      case Role:
        return OptionType.ROLE;
      case ClientUser:
        return OptionType.USER;
    }
  }

  protected constructor() {
    super();
  }

  static create(
    name: string,
    type: OptionValueType,
    description?: string,
    required?: boolean,
    index?: number
  ) {
    const option = new DOption();

    option._name = name;
    option._type = type || String;
    option._description = description || `${name} - ${option.stringType}`;
    option._required =
      required !== undefined ? required : Client.requiredByDefault;
    option._index = index;

    return option;
  }

  toObject(): ApplicationCommandOptionData {
    const data: ApplicationCommandOptionData = {
      description: this.description,
      name: this.name,
      type: this.stringType,
      required: this.required,
      choices: this.choices.map((choice) => choice.toObject()),
      options: this.options.map((option) => option.toObject())
    };

    if (!this.isNode) {
      delete data.required;
    }

    return data;
  }
}
