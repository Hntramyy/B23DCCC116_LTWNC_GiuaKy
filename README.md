# Mini Library

Ứng dụng tra cứu và mượn/trả sách cho thư viện khoa — React + TypeScript + Vite.

## Chạy dự án

```bash
npm install
npm run dev      # chạy app tại http://localhost:5173
npm test         # chạy toàn bộ test (Jest + React Testing Library)
npm run build    # type-check + build production
```

Giả lập API lỗi: mở `http://localhost:5173/?fail=1` → app hiện thông báo lỗi và nút "Thử lại".

## Cấu trúc thư mục (feature-based)

```
src/
├── api/booksApi.ts                  # API giả lập (Promise + setTimeout 500ms, tham số shouldFail)
├── components/icons.tsx             # bộ icon SVG dùng chung
├── app/
│   ├── store.ts                     # configureStore + đăng ký middleware
│   └── hooks.ts                     # useAppDispatch / useAppSelector
├── features/
│   ├── books/
│   │   ├── booksSlice.ts            # createSlice + createAsyncThunk (pending/fulfilled/rejected)
│   │   ├── booksSelectors.ts        # selector (createSelector)
│   │   ├── booksSlice.test.ts
│   │   └── components/
│   │       ├── BookItem.tsx         # React.memo
│   │       ├── BookItem.test.tsx
│   │       ├── BookList.tsx         # useMemo lọc danh sách, useCallback handler
│   │       └── BorrowQuota.tsx      # chỉ báo số sách đang mượn (x/3)
│   ├── borrow/borrowLimitMiddleware.ts  # middleware giới hạn mượn 3 cuốn
│   ├── filters/
│   │   ├── filterStore.ts           # Zustand: từ khoá + thể loại
│   │   └── components/SearchBar.tsx, CategoryFilter.tsx
│   ├── theme/
│   │   ├── ThemeContext.tsx         # Context + useMemo value + hook useTheme
│   │   └── ThemeToggle.tsx
│   └── stats/StatsPage.tsx          # route /stats, lazy load
├── hooks/
│   ├── useDebounce.ts               # useDebounce<T>
│   └── useDebounce.test.ts          # fake timers
├── pages/HomePage.tsx
├── types/
│   ├── api.ts                       # ApiResponse<T> + type guard isApiSuccess
│   └── book.ts                      # Book, Category, Utility Types (Omit, Pick, Record)
├── App.tsx                          # Routes + React.lazy + Suspense
└── main.tsx
```

## Đối chiếu yêu cầu kỹ thuật

| Yêu cầu | Vị trí |
| --- | --- |
| Generic `{ ok: true, data } \| { ok: false, error }` + type guard | `src/types/api.ts` |
| Utility Types (`Omit`, `Pick`, `Record`, `Partial`, `ReadonlyArray`) | `src/types/book.ts`, `booksApi.ts`, test |
| createSlice, createAsyncThunk 3 trạng thái, typed hooks | `features/books/booksSlice.ts`, `app/hooks.ts` |
| Middleware giới hạn 3 cuốn | `features/borrow/borrowLimitMiddleware.ts` |
| Zustand cho bộ lọc | `features/filters/filterStore.ts` |
| Context theme + useMemo + useTheme | `features/theme/ThemeContext.tsx` |
| useDebounce&lt;T&gt; (300ms) | `hooks/useDebounce.ts`, dùng ở `SearchBar.tsx` |
| useMemo / React.memo / useCallback / key = id | `BookList.tsx`, `BookItem.tsx` |
| React.lazy + Suspense cho /stats | `App.tsx` |
| Test reducer (8) + middleware (1), component (4), useDebounce (1) | `*.test.ts(x)` |
