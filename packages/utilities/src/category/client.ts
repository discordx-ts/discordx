import { ClassMethodDecorator, Client } from "discordx";

export type CategoryItemType =
  | "SLASH"
  | "SIMPLECOMMAND"
  | "EVENT"
  | "CONTEXT USER"
  | "CONTEXT MESSAGE";

export interface CategoryItem {
  name: string;
  description?: string;
  type: CategoryItemType;
}

export interface CategoryMeta {
  name: string;
  description?: string;
  items: CategoryItem[];
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
  items: CategoryItem[]
): ClassMethodDecorator;

export function Category(
  name: string,
  arg?: string | CategoryItem[]
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
