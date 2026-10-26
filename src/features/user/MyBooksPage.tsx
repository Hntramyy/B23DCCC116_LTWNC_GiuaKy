import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { BookIcon } from '../../components/icons';
import type { BookId } from '../../types/book';
import { selectBorrowedBooks } from '../books/booksSelectors';
import { borrowBook } from '../books/booksSlice';
import { BookItem } from '../books/components/BookItem';
import { useReturnBook } from '../books/hooks/useReturnBook';
import { MAX_BORROW } from '../borrow/borrowLimitMiddleware';
import { Avatar } from './Avatar';

export default function MyBooksPage() {
  const dispatch = useAppDispatch();
  const borrowedBooks = useAppSelector(selectBorrowedBooks);
  const handleReturn = useReturnBook();
  const handleBorrow = useCallback((id: BookId) => dispatch(borrowBook(id)), [dispatch]);

  const count = borrowedBooks.length;

  return (
    <>
      <div className="page-header">
        <div className="profile">
          <Avatar size="lg" />
          <div>
            <h1 className="page-title">Sách của tôi</h1>
            <p className="page-meta">
              Đang mượn <strong>{count}</strong>/{MAX_BORROW} cuốn · Còn được mượn <strong>{MAX_BORROW - count}</strong> cuốn
            </p>
          </div>
        </div>
      </div>

      {count === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <BookIcon width={22} height={22} />
          </div>
          <h3>Bạn chưa mượn cuốn sách nào</h3>
          <p>Mỗi sinh viên được mượn tối đa {MAX_BORROW} cuốn cùng lúc.</p>
          <Link to="/" className="btn btn-primary">
            Xem danh mục sách
          </Link>
        </div>
      ) : (
        <ul className="book-grid">
          {borrowedBooks.map((book) => (
            <BookItem key={book.id} book={book} isBorrowed onBorrow={handleBorrow} onReturn={handleReturn} />
          ))}
        </ul>
      )}
    </>
  );
}
