import {
  ChannelTypes,
  DApplicationCommandOptionChoice,
  SlashAutoCompleteOption,
  SlashOptionType,
} from "../../index.js";
import { ApplicationCommandOptionData } from "discord.js";
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
    type?: SlashOptionType,
    description?: string,
    required?: boolean,
    autocomplete?: SlashAutoCompleteOption,
    channelType?: ChannelTypes[],
    index?: number
  ) {
    super();

    this._name = name;
    this._type = type ?? "STRING";
    this._description = description ?? `${name} - ${this.type}`;
    this._required = required ?? false;
    this._channelTypes = channelType?.sort();
    this._index = index;
    this._autocomplete = autocomplete;
  }

  static create(
    name: string,
    type?: SlashOptionType,
    description?: string,
    required?: boolean,
    autocomplete?: SlashAutoCompleteOption,
    channelType?: ChannelTypes[],
    index?: number
  ): DApplicationCommandOption {
    return new DApplicationCommandOption(
      name,
      type,
      description,
      required,
      autocomplete,
      channelType,
      index
    );
  }

  toJSON(): ApplicationCommandOptionData {
    const options = [...this.options]
      .reverse()
      .map((option) => option.toJSON());

    const data: ApplicationCommandOptionData = {
      autocomplete: this.autocomplete ? true : undefined,
      channelTypes: this.channelTypes,
      choices:
        this.choices.length === 0
          ? undefined
          : this.choices.map((choice) => choice.toJSON()),
      description: this.description,
      name: this.name,
      options:
        options.length === 0 ? undefined : (options as unknown as undefined),
      required: !this.isNode ? undefined : this.required,
      type: this.type,
    };

    return data;
  }
}
