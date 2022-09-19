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

type CreateStructure = {
  autocomplete?: SlashAutoCompleteOption;
  channelType?: ChannelType[];
  description: string;
  descriptionLocalizations?: LocalizationMap | null;
  index?: number;
  maxLength?: number;
  maxValue?: number;
  minLength?: number;
  minValue?: number;
  name: string;
  nameLocalizations?: LocalizationMap | null;
  required?: boolean;
  type: ApplicationCommandOptionType;
};

/**
 * @category Decorator
 */
export class DApplicationCommandOption extends Decorator {
  private _autocomplete: SlashAutoCompleteOption;
  private _channelTypes: ChannelType[] | undefined = undefined;
  private _choices: DApplicationCommandOptionChoice[] = [];
  private _description: string;
  private _descriptionLocalizations: LocalizationMap | null;
  private _name: string;
  private _nameLocalizations: LocalizationMap | null;
  private _maxValue?: number;
  private _minValue?: number;
  private _maxLength?: number;
  private _minLength?: number;
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

  get descriptionLocalizations(): LocalizationMap | null {
    return this._descriptionLocalizations;
  }
  set descriptionLocalizations(value: LocalizationMap | null) {
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

  get maxLength(): number | undefined {
    return this._maxLength;
  }
  set maxLength(value: number | undefined) {
    this._maxLength = value;
  }

  get minLength(): number | undefined {
    return this._minLength;
  }
  set minLength(value: number | undefined) {
    this._minLength = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get nameLocalizations(): LocalizationMap | null {
    return this._nameLocalizations;
  }
  set nameLocalizations(value: LocalizationMap | null) {
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

  protected constructor(data: CreateStructure) {
    super();

    this._name = data.name;
    this._autocomplete = data.autocomplete;
    this._channelTypes = data.channelType?.sort();
    this._description = data.description;
    this._index = data.index;
    this._maxValue = data.maxValue;
    this._minValue = data.minValue;
    this._maxLength = data.maxLength;
    this._minLength = data.minLength;
    this._required = data.required ?? false;
    this._type = data.type;
    this._descriptionLocalizations = data.descriptionLocalizations ?? null;
    this._nameLocalizations = data.nameLocalizations ?? null;
  }

  static create(data: CreateStructure): DApplicationCommandOption {
    return new DApplicationCommandOption(data);
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
      maxLength: this.maxLength,
      maxValue: this.maxValue,
      minLength: this.minLength,
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
