import { ClassMethodDecorator, SlashOptionType } from "discordx";

export type CategoryItemTypes =
  | "SLASH"
  | "SIMPLECOMMAND"
  | "EVENT"
  | "CONTEXT USER"
  | "CONTEXT MESSAGE";

interface ICategoryBase {
  botIds?: string[];
  description?: string;
  examples?: string[];
  name: string;
}

export interface ICategoryItem extends ICategoryBase {
  type: Exclude<CategoryItemTypes, "SIMPLECOMMAND" | "SLASH">;
}

export interface ICategoryItemOption {
  description?: string;
  name: string;
  optional?: boolean;
  type: SlashOptionType;
}

export interface ICategoryAttachment {
  description?: string;
  extensions?: string[];
  name: string;
  optional?: boolean;
  type: string;
}

export interface ICategoryItemCommand extends ICategoryBase {
  attachments?: ICategoryAttachment[];
  groupId?: string;
  options: ICategoryItemOption[];
  type: Exclude<
    CategoryItemTypes,
    "EVENT" | "CONTEXT USER" | "CONTEXT MESSAGE"
  >;
}

export interface ICategory {
  description?: string;
  items: (ICategoryItem | ICategoryItemCommand)[];
  name: string;
}

export class CategoryMetaData {
  static categories = new Map<string, ICategory>();

  get categories(): Map<string, ICategory> {
    return CategoryMetaData.categories;
  }
}

/**
 * Category decorator
 * @param name category name
 */
export function Category(name: string): ClassMethodDecorator;

/**
 * Category decorator
 * @param name category name
 * @param description category description
 */
export function Category(
  name: string,
  description: string
): ClassMethodDecorator;

/**
 * Category decorator
 * @param name category name
 * @param items category items
 */
export function Category(
  name: string,
  items: (ICategoryItem | ICategoryItemCommand)[]
): ClassMethodDecorator;

export function Category(
  name: string,
  arg?: string | (ICategoryItem | ICategoryItemCommand)[]
): ClassMethodDecorator {
  if (!arg || typeof arg === "string") {
    const find = CategoryMetaData.categories.get(name);
    if (!find) {
      CategoryMetaData.categories.set(name, {
        description: arg,
        items: [],
        name,
      });
    } else {
      find.description = arg;
      CategoryMetaData.categories.set(name, find);
    }
  } else {
    const find = CategoryMetaData.categories.get(name);
    if (find) {
      find.items.push(...arg);
      CategoryMetaData.categories.set(name, find);
    } else {
      CategoryMetaData.categories.set(name, { items: arg, name });
    }
  }
  return () => {
    //
  };
}
