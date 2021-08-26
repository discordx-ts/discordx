import {
  CommandInteraction,
  ContextMenuInteraction,
  InteractionButtonOptions,
  MessageComponentInteraction,
} from "discord.js";

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
   * Button style.
   */
  style?: InteractionButtonOptions["style"];

  /**
   * select pagination type (default: BUTTON)
   */
  type?: "BUTTON";
}

interface SelectMenuPaginationOptions extends BasicPaginationOptions {
  /**
   * select pagination type (default: BUTTON)
   */
  type?: "SELECT_MENU";
}

export type PaginationOptions =
  | ButtonPaginationOptions
  | SelectMenuPaginationOptions;
