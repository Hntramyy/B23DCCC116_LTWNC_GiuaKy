import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setWarning, type BooksState } from '../books/booksSlice';

export const MAX_BORROW = 3;

/** Middleware tự viết: chặn action borrowBook khi sinh viên đã mượn đủ MAX_BORROW cuốn */
export const borrowLimitMiddleware: Middleware<object, { books: BooksState }> = (api) => (next) => (action) => {
  if (borrowBook.match(action) && api.getState().books.borrowedIds.length >= MAX_BORROW) {
    return api.dispatch(
      setWarning(`Bạn chỉ được mượn tối đa ${MAX_BORROW} cuốn cùng lúc. Hãy trả bớt sách trước khi mượn thêm.`),
    );
  }
  return next(action);
};
