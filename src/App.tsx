import { lazy, Suspense, useCallback, useEffect } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { AlertIcon, BookIcon, CloseIcon, RefreshIcon } from './components/icons';
import { selectBorrowedIds, selectError, selectStatus, selectWarning } from './features/books/booksSelectors';
import { fetchBooks, setWarning } from './features/books/booksSlice';
import { ThemeToggle } from './features/theme/ThemeToggle';
import { Avatar } from './features/user/Avatar';
import HomePage from './pages/HomePage';

const StatsPage = lazy(() => import('./features/stats/StatsPage'));
const MyBooksPage = lazy(() => import('./features/user/MyBooksPage'));

/** Thêm ?fail=1 vào URL để giả lập API lỗi */
const SIMULATE_FAIL = new URLSearchParams(window.location.search).has('fail');

const WARNING_TIMEOUT = 4000;

function LoadingSkeleton() {
  return (
    <div className="loading" aria-busy="true">
      <p className="loading-text">
        <span className="spinner" /> Đang tải...
      </p>
      <ul className="book-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={`skeleton-${i}`} className="book">
            <div className="sk sk-cover" />
            <div className="sk sk-line w-40" />
            <div className="sk sk-line w-80" />
            <div className="sk sk-line w-60" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const warning = useAppSelector(selectWarning);
  const borrowedCount = useAppSelector(selectBorrowedIds).length;

  useEffect(() => {
    dispatch(fetchBooks({ shouldFail: SIMULATE_FAIL }));
  }, [dispatch]);

  const handleRetry = useCallback(() => dispatch(fetchBooks()), [dispatch]);
  const handleCloseWarning = useCallback(() => dispatch(setWarning(null)), [dispatch]);

  useEffect(() => {
    if (!warning) return;
    const timer = setTimeout(handleCloseWarning, WARNING_TIMEOUT);
    return () => clearTimeout(timer);
  }, [warning, handleCloseWarning]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-logo">
              <BookIcon width={16} height={16} />
            </span>
            <span>Mini Library</span>
          </NavLink>

          <nav className="nav">
            <NavLink to="/" end>
              <span>Danh mục</span>
            </NavLink>
            <NavLink to="/my-books">
              <span>Sách của tôi</span>
              {borrowedCount > 0 && <span className="nav-badge">{borrowedCount}</span>}
            </NavLink>
            <NavLink to="/stats">
              <span>Thống kê</span>
            </NavLink>
          </nav>

          <div className="topbar-actions">
            <ThemeToggle />
            <NavLink to="/my-books" className="user-chip" title="Sách của tôi" aria-label="Sách của tôi">
              <Avatar />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="container">
        {(status === 'idle' || status === 'loading') && <LoadingSkeleton />}

        {status === 'failed' && (
          <div className="error-state card" role="alert">
            <div className="error-icon">
              <AlertIcon width={20} height={20} />
            </div>
            <h2>Không tải được dữ liệu</h2>
            <p>{error}</p>
            <button type="button" className="btn btn-primary" onClick={handleRetry}>
              <RefreshIcon width={16} height={16} />
              Thử lại
            </button>
          </div>
        )}

        {status === 'succeeded' && (
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/my-books" element={<MyBooksPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={<p className="result-count">Không tìm thấy trang.</p>} />
            </Routes>
          </Suspense>
        )}
      </main>

      {warning && (
        <div className="toast" role="alert">
          <AlertIcon className="toast-icon" />
          <span>{warning}</span>
          <button type="button" className="toast-close" aria-label="Đóng cảnh báo" onClick={handleCloseWarning}>
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      )}
    </div>
  );
}
