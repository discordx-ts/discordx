import { Decorator } from "@discordx/internal";
import type { ChannelType } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import type {
  ApplicationCommandOptionDataX,
  DApplicationCommandOptionChoice,
  SlashAutoCompleteOption,
} from "../../index.js";

/**
 * @category Decorator
 */
export class DApplicationCommandOption extends Decorator {
  private _autocomplete: SlashAutoCompleteOption;
  private _channelTypes: ChannelType[] | undefined = undefined;
  private _choices: DApplicationCommandOptionChoice[] = [];
  private _description: string | undefined;
  private _name: string;
  private _maxValue?: number;
  private _minValue?: number;
  private _options: DApplicationCommandOption[] = [];
  private _required = true;
  private _type: ApplicationCommandOptionType;

  get isNode(): boolean {
    return (
      this.type === ApplicationCommandOptionType.Subcommand ||
      this.type === ApplicationCommandOptionType.SubcommandGroup
    );
  }

  get options(): DApplicationCommandOption[] {
    return this._options;
  }
  set options(value: DApplicationCommandOption[]) {
    this._options = value;
  }

  get channelTypes(): ChannelType[] | undefined {
    return this._channelTypes;
  }
  set channelTypes(value: ChannelType[] | undefined) {
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

  get type(): ApplicationCommandOptionType {
    return this._type;
  }
  set type(value: ApplicationCommandOptionType) {
    this._type = value;
  }

  get autocomplete(): SlashAutoCompleteOption {
    return this._autocomplete;
  }
  set autocomplete(value: SlashAutoCompleteOption) {
    this._autocomplete = value;
  }

  get description(): string | undefined {
    return this._description;
  }
  set description(value: string | undefined) {
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
    channelType?: ChannelType[],
    description?: string,
    index?: number,
    maxValue?: number,
    minValue?: number,
    required?: boolean,
    type?: ApplicationCommandOptionType
  ) {
    super();

    this._name = name;
    this._autocomplete = autocomplete;
    this._channelTypes = channelType?.sort();
    this._description = description;
    this._index = index;
    this._maxValue = maxValue;
    this._minValue = minValue;
    this._required = required ?? true;
    this._type = type ?? ApplicationCommandOptionType.String;
  }

  static create(
    name: string,
    autocomplete?: SlashAutoCompleteOption,
    channelType?: ChannelType[],
    description?: string,
    index?: number,
    maxValue?: number,
    minValue?: number,
    required?: boolean,
    type?: ApplicationCommandOptionType
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

  toJSON(): ApplicationCommandOptionDataX {
    const options = [...this.options]
      .reverse()
      .map((option) => option.toJSON());

    const data: ApplicationCommandOptionDataX = {
      autocomplete: this.autocomplete ? true : undefined,
      channelTypes: this.channelTypes,
      choices: this.isNode
        ? undefined
        : this.choices.length === 0
        ? undefined
        : this.choices.map((choice) => choice.toJSON()),
      description: this.description,
      maxValue: this.maxValue,
      minValue: this.minValue,
      name: this.name,
      options: options.length === 0 ? undefined : options,
      required: this.isNode ? undefined : this.required,
      type: this.type,
    };

    return data;
  }
}
