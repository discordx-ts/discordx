/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  Attachment,
  BaseMessageOptions,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentEmojiResolvable,
  ContextMenuCommandInteraction,
  InteractionCollector,
  Message,
  MessageCollectorOptionsParams,
  MessageComponentInteraction,
  MessageComponentType,
  MessageEditAttachmentData,
  PartialGroupDMChannel,
  StringSelectMenuInteraction,
  TextBasedChannel,
} from "discord.js";

// By default, five minute.
export const defaultTime = 3e5;
export const defaultPerPageItem = 10;

const prefixId = "discordx@pagination@";
export const defaultIds = {
  buttons: {
    previous: `${prefixId}previous`,
    backward: `${prefixId}backward`,
    forward: `${prefixId}forward`,
    next: `${prefixId}next`,
    exit: `${prefixId}exit`,
  },
  menu: `${prefixId}menu`,
};

export interface PaginationItem extends BaseMessageOptions {
  attachments?: (Attachment | MessageEditAttachmentData)[];
}

export type PaginationInteractions =
  | CommandInteraction
  | MessageComponentInteraction
  | ContextMenuCommandInteraction;

export type PaginationSendTo =
  | PaginationInteractions
  | Message
  | Exclude<TextBasedChannel, PartialGroupDMChannel>;

export enum SelectMenuPageId {
  Start = -1,
  End = -2,
}

export interface BasicPaginationOptions
  extends MessageCollectorOptionsParams<MessageComponentType> {
  /**
   * Debug log
   */
  debug?: boolean;

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
   * Number of items shown per page in select menu
   */
  itemsPerPage?: number;

  /**
   * Pagination timeout callback
   */
  onTimeout?: (page: number, message: Message) => void;
}

export interface ButtonOptions {
  /**
   * Button emoji
   */
  emoji?: ComponentEmojiResolvable | null;

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

export interface NavigationButtonOptions {
  /**
   * Whether to show navigation buttons (e.g., next, previous, skip) in the pagination row.
   */
  disabled?: boolean;

  /**
   * Previous button options
   */
  previous?: ButtonOptions;

  /**
   * Backward button options (-10)
   */
  backward?: ButtonOptions;

  /**
   * Forward button options (+10)
   */
  forward?: ButtonOptions;

  /**
   * Next button options
   */
  next?: ButtonOptions;

  /**
   * Exit button options
   */
  exit?: ButtonOptions;

  /**
   * Number of pages to skip with skip buttons (default: 10)
   */
  skipAmount?: number;
}

export interface SelectMenuOptions {
  /**
   * Whether to show select menu in the pagination row.
   */
  disabled?: boolean;

  /**
   * Various labels
   */
  labels?: {
    end?: string;
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
   * Custom range placeholder format
   * Use {start}, {end}, and {total} as placeholders
   */
  rangePlaceholderFormat?: string;
}

export interface PaginationOptions extends BasicPaginationOptions {
  /**
   * Navigation button configuration
   */
  buttons?: NavigationButtonOptions;

  /**
   * Select menu configuration
   */
  selectMenu?: SelectMenuOptions;
}

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

export interface PaginationCollectors {
  buttonCollector: InteractionCollector<ButtonInteraction>;
  menuCollector: InteractionCollector<StringSelectMenuInteraction>;
}
