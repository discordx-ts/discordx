/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Pagination } from "./Pagination.js";
import type { PaginationItem } from "./types.js";

export type Resolver = (
  page: number,
  pagination: Pagination,
) => PaginationItem | Promise<PaginationItem>;

export class PaginationResolver<T extends Resolver = Resolver> {
  constructor(
    public resolver: T,
    public maxLength: number,
  ) {}
}
