import { memo } from 'react';
import { UserIcon } from '../../../components/icons';
import type { Book, BookId } from '../../../types/book';
import { getCover } from '../bookCover';
import { CATEGORY_META } from '../categoryMeta';

export interface BookItemProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (id: BookId) => void;
  onReturn: (id: BookId) => void;
}

function stockTone(available: number): 'ok' | 'low' | 'out' {
  if (available <= 0) return 'out';
  return available === 1 ? 'low' : 'ok';
}

function BookItemComponent({ book, isBorrowed, onBorrow, onReturn }: BookItemProps) {
  const { tone } = CATEGORY_META[book.category];
  const cover = getCover(book.id);
  const stock = stockTone(book.available);

  return (
    <li className={`book${stock === 'out' && !isBorrowed ? ' is-out' : ''}`} data-testid={`book-${book.id}`}>
      <div className="book-cover-wrap">
        {/* bìa vẽ bằng CSS; chữ trên bìa lấy từ data-* nên không lặp nội dung trong DOM */}
        <div
          className={`cover cover-${cover.variant}`}
          style={cover.style}
          data-title={book.title}
          data-author={book.author}
          aria-hidden="true"
        >
          <span className="cover-art" />
        </div>
        {isBorrowed && <span className="cover-badge badge-borrowed">Đang mượn</span>}
        {!isBorrowed && stock === 'out' && <span className="cover-badge badge-out">Hết sách</span>}
        {!isBorrowed && stock === 'low' && <span className="cover-badge badge-low">Sắp hết</span>}
      </div>

      <div className="book-body">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-author">
          <UserIcon width={13} height={13} />
          <span>{book.author}</span>
        </p>

        <dl className="book-specs">
          <div>
            <dt>Thể loại</dt>
            <dd>
              <span className={`dot tone-${tone}`} />
              {book.category}
            </dd>
          </div>
          <div>
            <dt>Năm xuất bản</dt>
            <dd>{book.year}</dd>
          </div>
          <div>
            <dt>Số bản còn</dt>
            <dd className={`stock stock-${stock}`}>
              <strong>{book.available}</strong> bản
            </dd>
          </div>
        </dl>

        {isBorrowed ? (
          <button type="button" className="btn btn-secondary btn-block" onClick={() => onReturn(book.id)}>
            Trả
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={stock === 'out'}
            title={stock === 'out' ? 'Sách đã hết bản' : undefined}
            onClick={() => onBorrow(book.id)}
          >
            Mượn
          </button>
        )}
      </div>
    </li>
  );
}

export const BookItem = memo(BookItemComponent);
