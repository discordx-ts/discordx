import {
  DApplicationCommandOptionChoice,
  SlashAutoCompleteOption,
  SlashOptionType,
} from "../..";
import { ApplicationCommandOptionData } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { Decorator } from "./Decorator";

/**
 * @category Decorator
 */
export class DApplicationCommandOption extends Decorator {
  private _autocomplete: SlashAutoCompleteOption;
  private _channelTypes: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[] = [];
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

  get channelTypes(): Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[] {
    return this._channelTypes;
  }
  set channelTypes(value: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[]) {
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
    this._autocomplete = autocomplete;
  }

  static create(
    name: string,
    type?: SlashOptionType,
    description?: string,
    required?: boolean,
    autocomplete?: SlashAutoCompleteOption,
    channelType?: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[],
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

  channelTypesEx(): (
    | "GUILD_TEXT"
    | "DM"
    | "GUILD_VOICE"
    | "GROUP_DM"
    | "GUILD_CATEGORY"
    | "GUILD_NEWS"
    | "GUILD_STORE"
    | "GUILD_NEWS_THREAD"
    | "GUILD_PUBLIC_THREAD"
    | "GUILD_PRIVATE_THREAD"
    | "GUILD_STAGE_VOICE"
    | undefined
  )[] {
    return this.channelTypes.map((ch) => {
      switch (ch) {
        case 0:
          return "GUILD_TEXT";
        case 1:
          return "DM";
        case 2:
          return "GUILD_VOICE";
        case 3:
          return "GROUP_DM";
        case 4:
          return "GUILD_CATEGORY";
        case 5:
          return "GUILD_NEWS";
        case 6:
          return "GUILD_STORE";
        case 10:
          return "GUILD_NEWS_THREAD";
        case 11:
          return "GUILD_PUBLIC_THREAD";
        case 12:
          return "GUILD_PRIVATE_THREAD";
        case 13:
          return "GUILD_STAGE_VOICE";
      }
    });
  }

  toJSON(config?: { channelString: boolean }): ApplicationCommandOptionData {
    const options = [...this.options]
      .reverse()
      .map((option) => option.toJSON());

    const data: ApplicationCommandOptionData = {
      autocomplete: this.autocomplete ? true : undefined,
      channelTypes:
        this.channelTypes.length === 0
          ? undefined
          : config?.channelString
          ? (this.channelTypesEx() as unknown as undefined)
          : this.channelTypes,
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
