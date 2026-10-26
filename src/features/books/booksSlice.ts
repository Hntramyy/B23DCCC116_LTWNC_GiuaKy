import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchBooksApi, type FetchBooksOptions } from '../../api/booksApi';
import { isApiSuccess } from '../../types/api';
import type { Book, BookId, LoadingStatus } from '../../types/book';

export interface BooksState {
  items: Book[];
  borrowedIds: BookId[];
  status: LoadingStatus;
  error: string | null;
  warning: string | null;
}

export const initialState: BooksState = {
  items: [],
  borrowedIds: [],
  status: 'idle',
  error: null,
  warning: null,
};

export const fetchBooks = createAsyncThunk<
  Book[],
  FetchBooksOptions | undefined,
  { rejectValue: string; state: { books: BooksState } }
>(
  'books/fetchBooks',
  async (options, { rejectWithValue }) => {
    const res = await fetchBooksApi(options);
    if (isApiSuccess(res)) {
      return res.data;
    }
    return rejectWithValue(res.error);
  },
  {
    // tránh gọi API 2 lần khi đang tải (StrictMode chạy effect 2 lần)
    condition: (_options, { getState }) => getState().books.status !== 'loading',
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook(state, action: PayloadAction<BookId>) {
      const book = state.items.find((b) => b.id === action.payload);
      if (!book || book.available <= 0 || state.borrowedIds.includes(book.id)) return;
      book.available -= 1;
      state.borrowedIds.push(book.id);
      state.warning = null;
    },
    returnBook(state, action: PayloadAction<BookId>) {
      if (!state.borrowedIds.includes(action.payload)) return;
      const book = state.items.find((b) => b.id === action.payload);
      if (book) book.available += 1;
      state.borrowedIds = state.borrowedIds.filter((id) => id !== action.payload);
      state.warning = null;
    },
    setWarning(state, action: PayloadAction<string | null>) {
      state.warning = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.borrowedIds = [];
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi';
      });
  },
});

export const { borrowBook, returnBook, setWarning } = booksSlice.actions;
export default booksSlice.reducer;
