import {
  CommandInteraction,
  ContextMenuInteraction,
  InteractionButtonOptions,
  MessageComponentInteraction,
} from "discord.js";

// By default, it's half an hour.
export const defaultTime = 1800000;

export enum defaultIds {
  startButton = "discordxPaginationStartButton",
  endButton = "discordxpaginationendButton",
  nextButton = "discordxpaginationnextButton",
  previousButton = "discordxpaginationpreviousButton",
  menuId = "discordxpaginationmenu",
}

export type PaginationInteractions =
  | CommandInteraction
  | MessageComponentInteraction
  | ContextMenuInteraction;

interface BasicPaginationOptions {
  /**
   * Interaction ephemeral
   */
  ephemeral?: boolean;

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
