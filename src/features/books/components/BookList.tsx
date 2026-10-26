import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { SearchIcon } from '../../../components/icons';
import type { BookId } from '../../../types/book';
import { useFilterStore } from '../../filters/filterStore';
import { selectBooks, selectBorrowedIds } from '../booksSelectors';
import { borrowBook } from '../booksSlice';
import { useReturnBook } from '../hooks/useReturnBook';
import { BookItem } from './BookItem';

export function BookList() {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const borrowedIds = useAppSelector(selectBorrowedIds);
  const keyword = useFilterStore((s) => s.keyword);
  const category = useFilterStore((s) => s.category);
  const resetFilters = useFilterStore((s) => s.reset);

  const filteredBooks = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return books.filter((book) => {
      const matchCategory = category === 'ALL' || book.category === category;
      const matchKeyword = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
      return matchCategory && matchKeyword;
    });
  }, [books, keyword, category]);

  const borrowedSet = useMemo(() => new Set(borrowedIds), [borrowedIds]);

  const handleBorrow = useCallback((id: BookId) => dispatch(borrowBook(id)), [dispatch]);
  const handleReturn = useReturnBook();

  if (filteredBooks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <SearchIcon width={22} height={22} />
        </div>
        <h3>Không tìm thấy sách phù hợp</h3>
        <p>Thử từ khoá khác hoặc chọn lại thể loại.</p>
        <button type="button" className="btn btn-secondary" onClick={resetFilters}>
          Xoá bộ lọc
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="result-count">
        {filteredBooks.length} / {books.length} đầu sách
        {keyword && <> · Kết quả cho “{keyword}”</>}
      </p>
      <ul className="book-grid">
        {filteredBooks.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            isBorrowed={borrowedSet.has(book.id)}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        ))}
      </ul>
    </>
  );
}
