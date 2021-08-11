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
export * from "./decorators/Button";
export * from "./decorators/SelectMenu";
export * from "./decorators/Command";
export * from "./decorators/CommandOption";

export * from "./params/OptionParams";
export * from "./params/SlashParams";

export * from "./classes/DSelectMenuComponent";
export * from "./classes/DButtonComponent";
export * from "./classes/Decorator";
export * from "./classes/DGuard";
export * from "./classes/DDiscord";
export * from "./classes/DOn";
export * from "./classes/DApplicationCommand";
export * from "./classes/DSlashOption";
export * from "./classes/DSlashChoice";
export * from "./classes/Modifier";
export * from "./classes/Method";
export * from "./classes/DSlashGroup";
