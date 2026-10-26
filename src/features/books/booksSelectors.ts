import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { CATEGORIES, type CategoryStats } from '../../types/book';

export const selectBooks = (state: RootState) => state.books.items;
export const selectBorrowedIds = (state: RootState) => state.books.borrowedIds;
export const selectStatus = (state: RootState) => state.books.status;
export const selectError = (state: RootState) => state.books.error;
export const selectWarning = (state: RootState) => state.books.warning;

export const selectBorrowedBooks = createSelector([selectBooks, selectBorrowedIds], (books, ids) =>
  books.filter((book) => ids.includes(book.id)),
);

export const selectCategoryStats = createSelector([selectBooks], (books): CategoryStats => {
  const stats = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as CategoryStats;
  books.forEach((book) => {
    stats[book.category] += 1;
  });
  return stats;
});
