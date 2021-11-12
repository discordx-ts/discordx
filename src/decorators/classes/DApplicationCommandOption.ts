import {
  ApplicationCommandOptionDatax,
  ChannelTypes,
  DApplicationCommandOptionChoice,
  SlashAutoCompleteOption,
  SlashOptionType,
} from "../../index.js";
import { Decorator } from "./Decorator.js";

/**
 * @category Decorator
 */
export class DApplicationCommandOption extends Decorator {
  private _autocomplete: SlashAutoCompleteOption;
  private _channelTypes: ChannelTypes[] | undefined = undefined;
  private _choices: DApplicationCommandOptionChoice[] = [];
  private _description: string;
  private _isNode = false;
  private _name: string;
  private _maxValue?: number;
  private _minValue?: number;
  private _options: DApplicationCommandOption[] = [];
  private _required = false;
  private _type: SlashOptionType;

  get isNode(): boolean {
    return this._isNode;
  }
  set isNode(value: boolean) {
    this._isNode = value;
  }

  get options(): DApplicationCommandOption[] {
    return this._options;
  }
  set options(value: DApplicationCommandOption[]) {
    this._options = value;
  }

  get channelTypes(): ChannelTypes[] | undefined {
    return this._channelTypes;
  }
  set channelTypes(value: ChannelTypes[] | undefined) {
    this._channelTypes = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get maxValue(): number | undefined {
    return this._maxValue;
  }
  set maxValue(value: number | undefined) {
    this._maxValue = value;
  }

  get minValue(): number | undefined {
    return this._minValue;
  }
  set minValue(value: number | undefined) {
    this._minValue = value;
  }

  get type(): SlashOptionType {
    return this._type;
  }
  set type(value: SlashOptionType) {
    this._type = value;
  }

  get autocomplete(): SlashAutoCompleteOption {
    return this._autocomplete;
  }
  set autocomplete(value: SlashAutoCompleteOption) {
    this._autocomplete = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = value;
  }

  get choices(): DApplicationCommandOptionChoice[] {
    return this._choices;
  }
  set choices(value: DApplicationCommandOptionChoice[]) {
    this._choices = value;
  }
  protected constructor(
    name: string,
    autocomplete?: SlashAutoCompleteOption,
    channelType?: ChannelTypes[],
    description?: string,
    index?: number,
    maxValue?: number,
    minValue?: number,
    required?: boolean,
    type?: SlashOptionType
  ) {
    super();

    this._name = name;
    this._autocomplete = autocomplete;
    this._channelTypes = channelType?.sort();
    this._description = description ?? `${name} - ${type ?? "STRING"}`;
    this._index = index;
    this._maxValue = maxValue;
    this._minValue = minValue;
    this._required = required ?? false;
    this._type = type ?? "STRING";
  }

  static create(
    name: string,
    autocomplete?: SlashAutoCompleteOption,
    channelType?: ChannelTypes[],
    description?: string,
    index?: number,
    maxValue?: number,
    minValue?: number,
    required?: boolean,
    type?: SlashOptionType
  ): DApplicationCommandOption {
    return new DApplicationCommandOption(
      name,
      autocomplete,
      channelType,
      description,
      index,
      maxValue,
      minValue,
      required,
      type
    );
  }

  toJSON(): ApplicationCommandOptionDatax {
    const options = [...this.options]
      .reverse()
      .map((option) => option.toJSON());

    const data: ApplicationCommandOptionDatax = {
      autocomplete: this.autocomplete ? true : undefined,
      channelTypes: this.channelTypes,
      choices:
        this.choices.length === 0
          ? undefined
          : this.choices.map((choice) => choice.toJSON()),
      description: this.description,
      maxValue: this.maxValue,
      minValue: this.minValue,
      name: this.name,
      options: options.length === 0 ? undefined : options,
      required: !this.isNode ? undefined : this.required,
      type: this.type,
    };

    return data;
  }
}
