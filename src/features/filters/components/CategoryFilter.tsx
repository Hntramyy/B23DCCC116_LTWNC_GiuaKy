import { useAppSelector } from '../../../app/hooks';
import { CATEGORIES, type CategoryFilter as CategoryFilterValue } from '../../../types/book';
import { selectBooks, selectCategoryStats } from '../../books/booksSelectors';
import { useFilterStore } from '../filterStore';

const OPTIONS: ReadonlyArray<{ value: CategoryFilterValue; label: string }> = [
  { value: 'ALL', label: 'Tất cả' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function CategoryFilter() {
  const category = useFilterStore((s) => s.category);
  const setCategory = useFilterStore((s) => s.setCategory);
  const total = useAppSelector(selectBooks).length;
  const stats = useAppSelector(selectCategoryStats);

  return (
    <div className="segmented" role="group" aria-label="Lọc theo thể loại">
      {OPTIONS.map((opt) => {
        const active = category === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            className={active ? 'segment active' : 'segment'}
            aria-pressed={active}
            onClick={() => setCategory(opt.value)}
          >
            {opt.label}
            <span className="segment-count">{opt.value === 'ALL' ? total : stats[opt.value]}</span>
          </button>
        );
      })}
    </div>
  );
}
