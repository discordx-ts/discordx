/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type {
  ActionRowBuilder,
  APIMessageComponentEmoji,
  AttachmentPayload,
  BaseMessageOptions,
  ButtonStyle,
  CommandInteraction,
  ContextMenuCommandInteraction,
  JSONEncodable,
  Message,
  MessageActionRowComponentBuilder,
  MessageCollectorOptionsParams,
  MessageComponentInteraction,
  MessageComponentType,
  PartialGroupDMChannel,
  TextBasedChannel,
} from "discord.js";

// By default, five minute.
export const defaultTime = 3e5;

const prefixId = "discordx@pagination@";
export const defaultIds = {
  buttons: {
    end: `${prefixId}endButton`,
    exit: `${prefixId}closeButton`,
    next: `${prefixId}nextButton`,
    previous: `${prefixId}previousButton`,
    start: `${prefixId}startButton`,
  },
  menu: `${prefixId}menu`,
};

export type PaginationItem = BaseMessageOptions & {
  attachments?: JSONEncodable<AttachmentPayload>[];
};

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
  Exit = -3,
}

export enum PaginationType {
  Button,
  SelectMenu,
}

interface BasicPaginationOptions
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
   * Pagination timeout callback
   */
  onTimeout?: (page: number, message: Message) => void;

  /**
   * Show start/end button/option (default: true)
   * Use number to limit based on minimum pages
   */
  showStartEnd?: boolean | number;
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

export interface IGeneratePage {
  newMessage: BaseMessageOptions;
  paginationRow: ActionRowBuilder<MessageActionRowComponentBuilder>;
}
