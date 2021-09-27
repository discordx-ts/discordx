import {
  CommandInteraction,
  ContextMenuInteraction,
  InteractionButtonOptions,
  MessageComponentInteraction,
  MessageEmbed,
  MessageOptions,
} from "discord.js";

// By default, it's half an hour.
export const defaultTime = 1_800_000;

export enum defaultIds {
  startButton = "discordx@pagination@startButton",
  endButton = "discordx@pagination@endButton",
  nextButton = "discordx@pagination@nextButton",
  previousButton = "discordx@pagination@previousButton",
  menuId = "discordx@pagination@menu",
}

export type paginationFunc = (
  page: number
) => string | MessageEmbed | MessageOptions;

export type PaginationInteractions =
  | CommandInteraction
  | MessageComponentInteraction
  | ContextMenuInteraction;

interface BasicPaginationOptions {
  /**
   * Initial page (default: 0)
   */
  initialPage?: number;

  /**
   * In milliseconds, how long should the paginator run. (Default: 30min)
   */
  time?: number;
}

interface ButtonPaginationOptions extends BasicPaginationOptions {
  /**
   * Custom end button id (default: 'discordx@pagination@endButton')
   */
  endId?: string;

  /**
   * The text that will appear on the end button (Default: 'End')
   */
  endLabel?: string;

  /**
   * custom next button id (default: 'discordx@pagination@nextButton')
   */
  nextId?: string;

  /**
   * The text that will appear on the next button (Default: 'Next')
   */
  nextLabel?: string;

  /**
   * custom previous button id (default: 'discordx@pagination@previousButton')
   */
  previousId?: string;

  /**
   * The text that will appear on the previous button. (Default: 'Previous').
   */
  previousLabel?: string;

  /**
   * Show start/end buttons for large list (items more then 10) (default: true)
   */
  startEndButtons?: boolean;

  /**
   * custom start button id (default: 'discordx@pagination@startButton')
   */
  startId?: string;

  /**
   * The text that will appear on the start button (Default: 'Start')
   */
  startLabel?: string;

  /**
   * Button style.
   */
  style?: InteractionButtonOptions["style"];

  /**
   * select pagination type (default: BUTTON)
   */
  type: "BUTTON";
}

interface SelectMenuPaginationOptions extends BasicPaginationOptions {
  /**
   * select pagination type (default: BUTTON)
   */
  type: "SELECT_MENU";

  /**
   * custom select menu id (default: 'discordx@pagination@menu')
   */
  menuId?: string;

  /**
   * Define page text, use `{page}` to print page number
   * Different page texts can also be defined for different items using arrays
   */
  pageText?: string | string[];

  /**
   * Set placeholder text
   */
  placeholder?: string;

  /**
   * Start label
   */
  startLabel?: string;

  /**
   * End label
   */
  endLabel?: string;
}

export type PaginationOptions =
  | ButtonPaginationOptions
  | SelectMenuPaginationOptions;

export interface IPaginate {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
}
