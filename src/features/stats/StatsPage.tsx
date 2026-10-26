import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { CATEGORIES } from '../../types/book';
import { selectBooks, selectBorrowedIds, selectCategoryStats } from '../books/booksSelectors';
import { CATEGORY_META } from '../books/categoryMeta';
import { MAX_BORROW } from '../borrow/borrowLimitMiddleware';

export default function StatsPage() {
  const books = useAppSelector(selectBooks);
  const borrowedIds = useAppSelector(selectBorrowedIds);
  const stats = useAppSelector(selectCategoryStats);

  const totalCopies = useMemo(() => books.reduce((sum, b) => sum + b.available, 0), [books]);
  const maxCount = Math.max(1, ...CATEGORIES.map((c) => stats[c]));

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Thống kê</h1>
      </div>

      <div className="kpi-grid">
        <div className="card kpi">
          <span className="kpi-label">Tổng đầu sách</span>
          <span className="kpi-value">{books.length}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Bản sách còn trong kho</span>
          <span className="kpi-value">{totalCopies}</span>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Sách đang mượn</span>
          <span className="kpi-value">
            {borrowedIds.length}
            <small> / {MAX_BORROW}</small>
          </span>
        </div>
      </div>

      <section className="card">
        <h2 className="card-title">Số đầu sách theo thể loại</h2>
        <ul className="bar-list">
          {CATEGORIES.map((category) => {
            const { tone } = CATEGORY_META[category];
            const value = stats[category];
            const percent = books.length ? Math.round((value / books.length) * 100) : 0;
            return (
              <li key={category} className="bar-row">
                <span className="bar-label">
                  <span className={`dot tone-${tone}`} />
                  {category}
                </span>
                <span className="bar-track">
                  <span className={`bar-fill tone-${tone}`} style={{ width: `${(value / maxCount) * 100}%` }} />
                </span>
                <span className="bar-value">
                  {value} <small>({percent}%)</small>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
