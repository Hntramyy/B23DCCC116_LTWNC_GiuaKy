import { useCallback } from 'react';
import { useAppDispatch, useAppStore } from '../../../app/hooks';
import { useConfirm } from '../../../components/ConfirmDialog';
import type { BookId } from '../../../types/book';
import { returnBook } from '../booksSlice';

/**
 * Trả sách có hỏi xác nhận trước. Callback ổn định (không phụ thuộc danh sách sách)
 * nên không làm các BookItem bọc React.memo bị render lại.
 */
export function useReturnBook() {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const confirm = useConfirm();

  return useCallback(
    async (id: BookId) => {
      const book = store.getState().books.items.find((b) => b.id === id);
      const confirmed = await confirm({
        title: 'Xác nhận trả sách',
        message: (
          <>
            Bạn có chắc muốn trả cuốn <strong>{book?.title ?? 'này'}</strong>? Sau khi trả, sách sẽ được
            chuyển lại cho thư viện.
          </>
        ),
        confirmText: 'Trả sách',
        cancelText: 'Huỷ',
      });
      if (confirmed) dispatch(returnBook(id));
    },
    [confirm, dispatch, store],
  );
}
