import {
  ButtonComponent,
  SelectMenuComponent,
  SimpleCommand,
  SimpleCommandOption,
} from "..";
import { SlashChoice } from "./decorators/SlashChoice";
import { SlashGroup } from "./decorators/SlashGroup";
import { SlashOption } from "./decorators/SlashOption";

/**
 * @deprecated Use `SlashOption` instead.
 */
export const Option = SlashOption;

/**
 * @deprecated Use `SlashChoice` instead.
 */
export const Choice = SlashChoice;

/**
 * @deprecated Use `SlashChoice` instead.
 */
export const Choices = SlashChoice;

/**
 * @deprecated Use `SlashGroup` instead.
 */
export const Group = SlashGroup;

/**
 * @deprecated Use `ButtonComponent` instead.
 */
export const Button = ButtonComponent;

/**
 * @deprecated Use `SelectMenuComponent` instead.
 */
export const SelectMenu = SelectMenuComponent;

/**
 * @deprecated Use `SimpleCommand` instead.
 */
export const Command = SimpleCommand;

/**
 * @deprecated Use `SimpleCommandOption` instead.
 */
export const CommandOption = SimpleCommandOption;

// remove above area by end of auguest

export * from "./decorators/On";
export * from "./decorators/Once";
export * from "./decorators/Guard";
export * from "./decorators/Discord";
export * from "./decorators/Description";
export * from "./decorators/Name";
export * from "./decorators/Slash";
export * from "./decorators/SlashOption";
export * from "./decorators/SlashChoice";
export * from "./decorators/DefaultPermission";
export * from "./decorators/Permission";
export * from "./decorators/SlashGroup";
export * from "./decorators/Guild";
export * from "./decorators/Bot";
export * from "./decorators/ButtonComponent";
export * from "./decorators/SelectMenuComponent";
export * from "./decorators/SimpleCommand";
export * from "./decorators/SimpleCommandOption";
export * from "./decorators/ContextMenu";

export * from "./classes/DComponentSelectMenu";
export * from "./classes/DComponentButton";
export * from "./classes/DGuard";
export * from "./classes/DDiscord";
export * from "./classes/DOn";
export * from "./classes/DApplicationCommand";
export * from "./classes/DApplicationCommandOption";
export * from "./classes/DApplicationCommandOptionChoice";
export * from "./classes/DApplicationCommandGroup";
export * from "./classes/DSimpleCommand";
export * from "./classes/DSimpleCommandOption";
export * from "./classes/Modifier";

export * from "./params/EventParams";
export * from "./params/SimpleCommandParams";
export * from "./params/SlashOptionParams";
export * from "./params/SlashParams";
