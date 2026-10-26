# Mini Library

Bài giữa kỳ môn Lập trình Web nâng cao.

Web tra cứu và mượn/trả sách cho thư viện khoa. Sinh viên có thể tìm sách, lọc theo thể loại, mượn tối đa 3 cuốn và xem lại những cuốn mình đang mượn.

Làm bằng React + TypeScript (Vite), Redux Toolkit, Zustand, test bằng Jest và React Testing Library.

## Cách chạy

```bash
npm install
npm run dev
```

Mở http://localhost:5173 là dùng được.

Chạy test:

```bash
npm test
```

Muốn xem trường hợp API bị lỗi thì thêm `?fail=1` vào sau đường dẫn, ví dụ http://localhost:5173/?fail=1.

## Các trang

- `/` danh mục sách: tìm kiếm, lọc thể loại, mượn/trả
- `/my-books` những cuốn đang mượn
- `/stats` thống kê số đầu sách theo thể loại

## Phần làm theo yêu cầu đề

API giả lập ở `src/api/booksApi.ts`, trả về Promise và trễ 500ms. Truyền `shouldFail: true` để giả lập lỗi. Kiểu dữ liệu trả về là `ApiResponse<T>`, dùng hàm `isApiSuccess` để phân biệt thành công hay lỗi (`src/types/api.ts`). Utility type có dùng `Omit`, `Pick`, `Record` trong `src/types/book.ts`.

Danh sách sách và sách đang mượn để trong Redux (`src/features/books/booksSlice.ts`). `fetchBooks` viết bằng createAsyncThunk, có xử lý cả pending, fulfilled và rejected. Typed hooks nằm trong `src/app/hooks.ts`.

Giới hạn mượn 3 cuốn được chặn trong middleware `src/features/borrow/borrowLimitMiddleware.ts`. Khi mượn quá thì middleware không cho action đi tiếp và hiện cảnh báo.

Từ khoá tìm kiếm và thể loại đang lọc lưu bằng Zustand (`src/features/filters/filterStore.ts`). Giao diện sáng/tối dùng Context, có `useMemo` cho value và hook `useTheme` (`src/features/theme/ThemeContext.tsx`).

Ô tìm kiếm dùng hook `useDebounce<T>` với độ trễ 300ms (`src/hooks/useDebounce.ts`).

Về hiệu năng:
- danh sách sau khi lọc tính bằng `useMemo` trong `BookList.tsx`
- `BookItem` bọc `React.memo`, các hàm mượn/trả truyền xuống đều dùng `useCallback`, key là id sách
- trang thống kê và trang sách của tôi được lazy load bằng `React.lazy` + `Suspense`

Ngoài yêu cầu, mình có thêm hộp thoại xác nhận khi bấm "Trả" để tránh bấm nhầm (`src/components/ConfirmDialog.tsx`).

## Test

Có 16 test, chạy `npm test` đều pass:

- `booksSlice.test.ts`: 8 test cho reducer và 1 test cho middleware giới hạn mượn
- `BookItem.test.tsx`: 4 test (hiển thị thông tin, bấm Mượn gọi đúng id, nút bị khoá khi hết sách, nút Trả)
- `useDebounce.test.ts`: 1 test dùng fake timers
- `ConfirmDialog.test.tsx`: 2 test cho hộp thoại xác nhận
