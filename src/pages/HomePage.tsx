import { BookList } from '../features/books/components/BookList';
import { BorrowQuota } from '../features/books/components/BorrowQuota';
import { CategoryFilter } from '../features/filters/components/CategoryFilter';
import { SearchBar } from '../features/filters/components/SearchBar';

export default function HomePage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Danh mục sách</h1>
        <BorrowQuota />
      </div>

      <div className="toolbar">
        <SearchBar />
        <CategoryFilter />
      </div>

      <BookList />
    </>
  );
}
