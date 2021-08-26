import {
  CommandInteraction,
  ContextMenuInteraction,
  InteractionButtonOptions,
  MessageComponentInteraction,
} from "discord.js";

export enum defaultIds {
  nextButton = "discordx@pagination@nextButton",
  previousButton = "discordx@pagination@previousButton",
  menuId = "discordx@pagination@menu",
}

export type PaginationInteractions =
  | CommandInteraction
  | MessageComponentInteraction
  | ContextMenuInteraction;

interface BasicPaginationOptions {
  /**
   * With the paginated embeds, the message to be displayed.
   */
  content?: string;

  /**
   * Interaction ephemeral
   */
  ephemeral?: boolean;

  /**
   * Initial page (default: 0)
   */
  initialPage?: number;

  /**
   * The text that will appear on the next button (Default: 'Next')
   */
  nextLabel?: string;

  /**
   * The text that will appear on the previous button. (Default: 'Previous').
   */
  previousLabel?: string;

  /**
   *  Displaying the current page in the footer of each embed. (Default: true).
   */
  showPagePosition?: boolean;

  /**
   * In milliseconds, how long should the paginator run. (Default: 30min)
   */
  time?: number;
}

interface ButtonPaginationOptions extends BasicPaginationOptions {
  /**
   * custom next button id (default: 'discordx@pagination@nextButton')
   */
  nextButtonId?: string;

  /**
   * custom previous button id (default: 'discordx@pagination@previousButton')
   */
  previousButtonId?: string;

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
