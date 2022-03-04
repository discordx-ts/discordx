import type {
  ActionRow,
  ButtonStyle,
  CommandInteraction,
  ContextMenuCommandInteraction,
  Embed,
  Message,
  MessageComponentInteraction,
  MessageOptions,
  ReplyMessageOptions,
} from "discord.js";
import type { APIMessageComponentEmoji } from "discord-api-types/v9";

// By default, it's half an hour.
export const defaultTime = 18e5;

const prefixId = "discordx@pagination@";
export const defaultIds = {
  buttons: {
    end: prefixId + "endButton",
    exit: prefixId + "closeButton",
    next: prefixId + "nextButton",
    previous: prefixId + "previousButton",
    start: prefixId + "startButton",
  },
  menu: prefixId + "menu",
};

export type PaginationItem = string | Embed | MessageOptions;

export type PaginationInteractions =
  | CommandInteraction
  | MessageComponentInteraction
  | ContextMenuCommandInteraction;

export enum SelectMenuPageId {
  Start = -1,
  End = -2,
  Exit = -3,
}

export enum PaginationType {
  Button,
  SelectMenu,
}

interface BasicPaginationOptions {
  /**
   * Enable exit button, It will close the pagination before timeout
   */
  enableExit?: boolean;

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
  onTimeout?: (page: number, message: Message) => void;

  /**
   * Show start/end buttons for large list (items more then 10) (default: true)
   */
  showStartEnd?: boolean;

  /**
   * In milliseconds, how long should the paginator run. (Default: 30min)
   */
  time?: number;
}

interface ButtonOptions {
  /**
   * Button emoji
   */
  emoji?: APIMessageComponentEmoji;

  /**
   * Button id
   */
  id?: string;

  /**
   * Button label
   */
  label?: string;

  /**
   * Button style
   */
  style?: ButtonStyle;
}

interface ButtonPaginationOptions extends BasicPaginationOptions {
  /**
   * End button options
   */
  end?: ButtonOptions;

  /**
   * Exit button options
   */
  exit?: ButtonOptions;

  /**
   * Exit button options
   */
  next?: ButtonOptions;

  /**
   * Previous button options
   */
  previous?: ButtonOptions;

  /**
   * Start button options
   */
  start?: ButtonOptions;

  /**
   * select pagination type (default: BUTTON)
   */
  type: PaginationType.Button;
}

interface SelectMenuPaginationOptions extends BasicPaginationOptions {
  /**
   * Various labels
   */
  labels?: {
    end?: string;
    exit?: string;
    start?: string;
  };

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
   * select pagination type (default: BUTTON)
   */
  type: PaginationType.SelectMenu;
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

export type IGeneratePage = {
  newMessage: Omit<ReplyMessageOptions, "flags">;
  paginationRow: ActionRow;
};
