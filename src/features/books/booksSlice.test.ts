import { configureStore } from '@reduxjs/toolkit';
import type { Book } from '../../types/book';
import { borrowLimitMiddleware, MAX_BORROW } from '../borrow/borrowLimitMiddleware';
import booksReducer, { borrowBook, fetchBooks, initialState, returnBook, type BooksState } from './booksSlice';

const sampleBooks: Book[] = [
  { id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', year: 2008, available: 2 },
  { id: 'b2', title: 'Kinh tế vi mô', author: 'Mankiw', category: 'Kinh tế', year: 2018, available: 0 },
  { id: 'b3', title: 'English Grammar', author: 'Murphy', category: 'Ngoại ngữ', year: 2019, available: 1 },
  { id: 'b4', title: 'Nguyên lý kế toán', author: 'Trần Bình', category: 'Kinh tế', year: 2020, available: 3 },
];

const loadedState = (overrides: Partial<BooksState> = {}): BooksState => ({
  ...initialState,
  status: 'succeeded',
  items: sampleBooks.map((b) => ({ ...b })),
  ...overrides,
});

describe('booksSlice reducer', () => {
  it('trả về initial state khi nhận action không xác định', () => {
    expect(booksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('fetchBooks.pending: chuyển status sang loading và xoá lỗi cũ', () => {
    const state = booksReducer({ ...initialState, error: 'lỗi cũ' }, { type: fetchBooks.pending.type });
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fetchBooks.fulfilled: lưu danh sách sách và status succeeded', () => {
    const state = booksReducer(
      { ...initialState, status: 'loading' },
      { type: fetchBooks.fulfilled.type, payload: sampleBooks },
    );
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(sampleBooks);
  });

  it('fetchBooks.rejected: lưu thông báo lỗi và status failed', () => {
    const state = booksReducer(
      { ...initialState, status: 'loading' },
      { type: fetchBooks.rejected.type, payload: 'API lỗi', error: { message: 'Rejected' } },
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('API lỗi');
  });

  it('borrowBook: giảm số bản còn lại 1 và thêm vào danh sách đang mượn', () => {
    const state = booksReducer(loadedState(), borrowBook('b1'));
    expect(state.items.find((b) => b.id === 'b1')?.available).toBe(1);
    expect(state.borrowedIds).toEqual(['b1']);
  });

  it('borrowBook: không cho mượn sách đã hết bản', () => {
    const state = booksReducer(loadedState(), borrowBook('b2'));
    expect(state.items.find((b) => b.id === 'b2')?.available).toBe(0);
    expect(state.borrowedIds).toEqual([]);
  });

  it('returnBook: tăng số bản còn lại 1 và xoá khỏi danh sách đang mượn', () => {
    const borrowed = booksReducer(loadedState(), borrowBook('b3'));
    const state = booksReducer(borrowed, returnBook('b3'));
    expect(state.items.find((b) => b.id === 'b3')?.available).toBe(1);
    expect(state.borrowedIds).toEqual([]);
  });

  it('returnBook: bỏ qua sách không nằm trong danh sách đang mượn', () => {
    const before = loadedState();
    expect(booksReducer(before, returnBook('b1'))).toEqual(before);
  });
});

describe('borrowLimitMiddleware', () => {
  it(`chặn mượn cuốn thứ ${MAX_BORROW + 1} và hiển thị cảnh báo`, () => {
    const store = configureStore({
      reducer: { books: booksReducer },
      preloadedState: { books: loadedState() },
      middleware: (getDefault) => getDefault().concat(borrowLimitMiddleware),
    });

    ['b1', 'b3', 'b4'].forEach((id) => store.dispatch(borrowBook(id)));
    expect(store.getState().books.borrowedIds).toHaveLength(MAX_BORROW);

    store.dispatch(borrowBook('b1'));
    const { books } = store.getState();
    expect(books.borrowedIds).toHaveLength(MAX_BORROW);
    expect(books.items.find((b) => b.id === 'b1')?.available).toBe(1);
    expect(books.warning).toMatch(/tối đa 3 cuốn/);
  });
});
