import { Decorator } from "@discordx/internal";
import type {
  ApplicationCommandOptionData,
  ChannelType,
  LocalizationMap,
} from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

import type {
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
  private _description: string;
  private _descriptionLocalizations?: LocalizationMap;
  private _name: string;
  private _nameLocalizations?: LocalizationMap;
  private _maxValue?: number;
  private _minValue?: number;
  private _options: DApplicationCommandOption[] = [];
  private _required = true;
  private _type: ApplicationCommandOptionType;

  get autocomplete(): SlashAutoCompleteOption {
    return this._autocomplete;
  }
  set autocomplete(value: SlashAutoCompleteOption) {
    this._autocomplete = value;
  }

  get channelTypes(): ChannelType[] | undefined {
    return this._channelTypes;
  }
  set channelTypes(value: ChannelType[] | undefined) {
    this._channelTypes = value;
  }

  get choices(): DApplicationCommandOptionChoice[] {
    return this._choices;
  }
  set choices(value: DApplicationCommandOptionChoice[]) {
    this._choices = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get descriptionLocalizations(): LocalizationMap | undefined {
    return this._descriptionLocalizations;
  }
  set descriptionLocalizations(value: LocalizationMap | undefined) {
    this._descriptionLocalizations = value;
  }

  get isNode(): boolean {
    return (
      this.type === ApplicationCommandOptionType.Subcommand ||
      this.type === ApplicationCommandOptionType.SubcommandGroup
    );
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

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get nameLocalizations(): LocalizationMap | undefined {
    return this._nameLocalizations;
  }
  set nameLocalizations(value: LocalizationMap | undefined) {
    this._nameLocalizations = value;
  }

  get options(): DApplicationCommandOption[] {
    return this._options;
  }
  set options(value: DApplicationCommandOption[]) {
    this._options = value;
  }

  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = value;
  }

  get type(): ApplicationCommandOptionType {
    return this._type;
  }
  set type(value: ApplicationCommandOptionType) {
    this._type = value;
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
    type?: ApplicationCommandOptionType,
    descriptionLocalizations?: LocalizationMap,
    nameLocalizations?: LocalizationMap
  ) {
    super();

    this._name = name;
    this._autocomplete = autocomplete;
    this._channelTypes = channelType?.sort();
    this._description =
      description ??
      `${name} - ${
        ApplicationCommandOptionType[
          type ?? ApplicationCommandOptionType.String
        ]
      }`.toLowerCase();
    this._index = index;
    this._maxValue = maxValue;
    this._minValue = minValue;
    this._required = required ?? true;
    this._type = type ?? ApplicationCommandOptionType.String;
    this._descriptionLocalizations = descriptionLocalizations;
    this._nameLocalizations = nameLocalizations;
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
    type?: ApplicationCommandOptionType,
    descriptionLocalizations?: LocalizationMap,
    nameLocalizations?: LocalizationMap
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
      type,
      descriptionLocalizations,
      nameLocalizations
    );
  }

  toJSON(): ApplicationCommandOptionData {
    const options = [...this.options]
      .reverse()
      .map((option) => option.toJSON());

    const data: ApplicationCommandOptionData = {
      autocomplete: this.autocomplete ? true : undefined,
      channelTypes: this.channelTypes,
      choices: this.isNode
        ? undefined
        : this.choices.length === 0
        ? undefined
        : this.choices.map((choice) => choice.toJSON()),
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      maxValue: this.maxValue,
      minValue: this.minValue,
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      options: options.length === 0 ? undefined : options,
      required: this.isNode ? undefined : this.required,
      type: this.type,
    } as ApplicationCommandOptionData;

    return data;
  }
}
