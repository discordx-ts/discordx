import { ClassMethodDecorator, Client, SlashOptionType } from "discordx";

export type CategoryItemTypes =
  | "SLASH"
  | "SIMPLECOMMAND"
  | "EVENT"
  | "CONTEXT USER"
  | "CONTEXT MESSAGE";

export interface CategoryItem {
  botIds?: string[];
  examples?: string[];
  name: string;
  description?: string;
  type: Exclude<CategoryItemTypes, "SIMPLECOMMAND" | "SLASH">;
}

export interface CategoryItemCommand {
  botIds?: string[];
  examples?: string[];
  name: string;
  description?: string;
  options: CategoryItemOption[];
  type: Exclude<
    CategoryItemTypes,
    "EVENT" | "CONTEXT USER" | "CONTEXT MESSAGE"
  >;
}

export interface CategoryItemOption {
  name: string;
  description?: string;
  optional: boolean;
  type: SlashOptionType;
}

export interface CategoryMeta {
  name: string;
  description?: string;
  items: (CategoryItem | CategoryItemCommand)[];
}

export class CategoryClient extends Client {
  static categories = new Map<string, CategoryMeta>();

  get categories(): Map<string, CategoryMeta> {
    return CategoryClient.categories;
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
  items: (CategoryItem | CategoryItemCommand)[]
): ClassMethodDecorator;

export function Category(
  name: string,
  arg?: string | (CategoryItem | CategoryItemCommand)[]
): ClassMethodDecorator {
  if (!arg || typeof arg === "string") {
    CategoryClient.categories.set(name, { items: [], name });
  } else {
    const find = CategoryClient.categories.get(name);
    if (find) {
      find.items.push(...arg);
      CategoryClient.categories.set(name, find);
    }
  }
  return () => {
    //
  };
}
