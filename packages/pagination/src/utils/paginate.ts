/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { IPaginate } from "../pagination/types.js";

//#region Types and Interfaces

export interface PaginationConfig {
  totalItems: number;
  currentPage?: number;
  pageSize?: number;
  maxPages?: number;
}

//#endregion

//#region Constants

const DEFAULT_CURRENT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MAX_PAGES = 10;
const MIN_PAGE_NUMBER = 0;
const MIN_TOTAL_ITEMS = 0;
const MIN_PAGE_SIZE = 1;
const MIN_MAX_PAGES = 1;

//#endregion

//#region Input Validation

/**
 * Validates pagination input parameters
 * @param totalItems - Total number of items to paginate
 * @param currentPage - Current page number
 * @param pageSize - Number of items per page
 * @param maxPages - Maximum number of page links to display
 * @throws {Error} When validation fails
 */
function validatePaginationInputs(
  totalItems: number,
  currentPage: number,
  pageSize: number,
  maxPages: number,
): void {
  if (!Number.isInteger(totalItems) || totalItems < MIN_TOTAL_ITEMS) {
    throw new Error(
      `Total items must be a non-negative integer, received: ${totalItems.toString()}`,
    );
  }

  if (!Number.isInteger(currentPage) || currentPage < MIN_PAGE_NUMBER) {
    throw new Error(
      `Current page must be a non-negative integer, received: ${currentPage.toString()}`,
    );
  }

  if (!Number.isInteger(pageSize) || pageSize < MIN_PAGE_SIZE) {
    throw new Error(
      `Page size must be a positive integer, received: ${pageSize.toString()}`,
    );
  }

  if (!Number.isInteger(maxPages) || maxPages < MIN_MAX_PAGES) {
    throw new Error(
      `Max pages must be a positive integer, received: ${maxPages.toString()}`,
    );
  }
}

//#endregion

//#region Core Calculation Utilities

/**
 * Calculates the total number of pages based on total items and page size
 * @param totalItems - Total number of items
 * @param pageSize - Number of items per page
 * @returns Total number of pages
 */
function calculateTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Normalizes the current page to ensure it's within valid bounds
 * @param currentPage - The requested current page
 * @param totalPages - Total number of available pages
 * @returns Normalized current page within valid range
 */
function normalizeCurrentPage(currentPage: number, totalPages: number): number {
  if (totalPages === 0) return 0;
  return Math.max(MIN_PAGE_NUMBER, Math.min(currentPage, totalPages - 1));
}

/**
 * Calculates the range of pages to display in pagination controls
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param maxPages - Maximum number of page links to display
 * @returns Object containing start and end page numbers
 */
function calculatePageRange(
  currentPage: number,
  totalPages: number,
  maxPages: number,
): { startPage: number; endPage: number } {
  if (totalPages <= maxPages) {
    return { startPage: 0, endPage: totalPages - 1 };
  }

  const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
  const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;

  if (currentPage <= maxPagesBeforeCurrentPage) {
    // Current page is near the start
    return { startPage: 0, endPage: maxPages - 1 };
  }

  if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
    // Current page is near the end
    return {
      startPage: totalPages - maxPages,
      endPage: totalPages - 1,
    };
  }

  // Current page is in the middle
  return {
    startPage: currentPage - maxPagesBeforeCurrentPage,
    endPage: currentPage + maxPagesAfterCurrentPage,
  };
}

/**
 * Calculates the start and end item indexes for the current page
 * @param currentPage - Current page number
 * @param pageSize - Number of items per page
 * @param totalItems - Total number of items
 * @returns Object containing start and end indexes
 */
function calculateItemIndexes(
  currentPage: number,
  pageSize: number,
  totalItems: number,
): { startIndex: number; endIndex: number } {
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  return { startIndex, endIndex };
}

/**
 * Generates an array of page numbers for pagination controls
 * @param startPage - First page number to include
 * @param endPage - Last page number to include
 * @returns Array of page numbers
 */
function generatePageNumbers(startPage: number, endPage: number): number[] {
  const pageCount = endPage - startPage + 1;
  return Array.from({ length: pageCount }, (_, index) => startPage + index);
}

//#endregion

//#region Public API

/**
 * Creates pagination data for UI controls and data slicing
 * @param config - Pagination configuration object
 * @returns Complete pagination information
 * @throws {Error} When input validation fails
 *
 * @example
 * ```typescript
 * const pagination = createPagination({
 *   totalItems: 100,
 *   currentPage: 5,
 *   pageSize: 10,
 *   maxPages: 7
 * });
 * ```
 */
export function createPagination(config: PaginationConfig): IPaginate {
  const {
    totalItems,
    currentPage = DEFAULT_CURRENT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    maxPages = DEFAULT_MAX_PAGES,
  } = config;

  try {
    validatePaginationInputs(totalItems, currentPage, pageSize, maxPages);

    const totalPages = calculateTotalPages(totalItems, pageSize);
    const normalizedCurrentPage = normalizeCurrentPage(currentPage, totalPages);
    const { startPage, endPage } = calculatePageRange(
      normalizedCurrentPage,
      totalPages,
      maxPages,
    );
    const { startIndex, endIndex } = calculateItemIndexes(
      normalizedCurrentPage,
      pageSize,
      totalItems,
    );
    const pages = generatePageNumbers(startPage, endPage);

    return {
      currentPage: normalizedCurrentPage,
      endIndex,
      endPage,
      pageSize,
      pages,
      startIndex,
      startPage,
      totalItems,
      totalPages,
    };
  } catch (error) {
    throw new Error(
      `Pagination creation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

//#endregion
