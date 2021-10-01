import { ClassMethodDecorator, SlashOptionType } from "discordx";

export type CategoryItemTypes =
  | "SLASH"
  | "SIMPLECOMMAND"
  | "EVENT"
  | "CONTEXT USER"
  | "CONTEXT MESSAGE";

interface ICategoryBase {
  botIds?: string[];
  examples?: string[];
  name: string;
  description?: string;
}

export interface ICategoryItem extends ICategoryBase {
  type: Exclude<CategoryItemTypes, "SIMPLECOMMAND" | "SLASH">;
}

export interface ICategoryItemOption {
  name: string;
  description?: string;
  optional: boolean;
  type: SlashOptionType;
}

export interface ICategoryItemCommand extends ICategoryBase {
  options: ICategoryItemOption[];
  type: Exclude<
    CategoryItemTypes,
    "EVENT" | "CONTEXT USER" | "CONTEXT MESSAGE"
  >;
}

export interface ICategory {
  name: string;
  description?: string;
  items: (ICategoryItem | ICategoryItemCommand)[];
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
    CategoryMetaData.categories.set(name, { items: [], name });
  } else {
    const find = CategoryMetaData.categories.get(name);
    if (find) {
      find.items.push(...arg);
      CategoryMetaData.categories.set(name, find);
    }
  }
  return () => {
    //
  };
}
