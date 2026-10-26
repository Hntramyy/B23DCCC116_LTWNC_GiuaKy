import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { MAX_BORROW } from '../../borrow/borrowLimitMiddleware';
import { selectBorrowedIds } from '../booksSelectors';

/** Chỉ báo gọn số sách đang mượn (3 gáy sách), bấm vào để tới trang "Sách của tôi" */
export function BorrowQuota() {
  const count = useAppSelector(selectBorrowedIds).length;
  const isFull = count >= MAX_BORROW;

  return (
    <Link to="/my-books" className={`quota${isFull ? ' full' : ''}`} title="Xem sách của tôi">
      <span className="quota-spines" aria-hidden="true">
        {Array.from({ length: MAX_BORROW }, (_, i) => (
          <span key={`spine-${i}`} className={i < count ? 'quota-spine filled' : 'quota-spine'} />
        ))}
      </span>
      <span>
        Đang mượn <strong>{count}</strong>/{MAX_BORROW}
      </span>
    </Link>
  );
}
