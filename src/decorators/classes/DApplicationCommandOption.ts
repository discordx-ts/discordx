import {
  ApplicationCommandOptionData,
  Channel,
  ClientUser,
  Role,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";
import { Decorator } from "./Decorator";
import {
  DApplicationCommandOptionChoice,
  Client,
  OptionValueType,
  StringOptionType,
  OptionType,
} from "../..";

export class DApplicationCommandOption extends Decorator {
  private _required = false;
  private _name: string;
  private _description: string;
  private _type: OptionValueType;
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
      case Channel:
        return OptionType.CHANNEL;
      case TextChannel:
        return OptionType.CHANNEL;
      case VoiceChannel:
        return OptionType.CHANNEL;
      case Role:
        return OptionType.ROLE;
      case User:
        return OptionType.USER;
      case ClientUser:
        return OptionType.USER;
      default:
        return OptionType.STRING;
    }
  }

  protected constructor(
    name: string,
    type?: OptionValueType,
    description?: string,
    required?: boolean,
    index?: number
  ) {
    super();

    this._name = name.toLowerCase();
    this._type = type ?? String;
    this._description = description ?? `${name} - ${this.stringType}`;
    this._required =
      required !== undefined ? required : Client.requiredByDefault;
    this._index = index;
  }

  static create(
    name: string,
    type?: OptionValueType,
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
      description: this.description,
      name: this.name,
      type: this.stringType,
      required: this.required,
      choices: this.choices.map((choice) => choice.toObject()),
      //todo: fix this any
      options: [...this.options]
        .reverse()
        .map((option) => option.toObject() as any),
    };

    if (!this.isNode) {
      delete data.required;
    }

    return data;
  }
}
