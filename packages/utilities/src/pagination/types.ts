import {
  CommandInteraction,
  ContextMenuInteraction,
  InteractionButtonOptions,
  MessageComponentInteraction,
  MessageEmbed,
  MessageOptions,
} from "discord.js";
import { Pagination } from ".";

// By default, it's half an hour.
export const defaultTime = 1_800_000;

export enum defaultIds {
  endButton = "discordx@pagination@endButton",
  menuId = "discordx@pagination@menu",
  nextButton = "discordx@pagination@nextButton",
  previousButton = "discordx@pagination@previousButton",
  startButton = "discordx@pagination@startButton",
}

export type embedType = string | MessageEmbed | MessageOptions;

export type paginationFunc = (
  page: number,
  pagination: Pagination
) => embedType | Promise<embedType>;

export type PaginationInteractions =
  | CommandInteraction
  | MessageComponentInteraction
  | ContextMenuInteraction;

interface BasicPaginationOptions {
  /**
   * Set ephemeral response
   */
  ephemeral?: boolean;

  /**
   * Initial page (default: 0)
   */
  initialPage?: number;

  /**
   * Pagination timeout callback
   */
  onPaginationTimeout?: (page: number) => void;

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
   * End label
   */
  endLabel?: string;

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
   * select pagination type (default: BUTTON)
   */
  type: "SELECT_MENU";
}

export type PaginationOptions =
  | ButtonPaginationOptions
  | SelectMenuPaginationOptions;

export interface IPaginate {
  currentPage: number;
  endIndex: number;
  endPage: number;
  pageSize: number;
  pages: number[];
  startIndex: number;
  startPage: number;
  totalItems: number;
  totalPages: number;
}
