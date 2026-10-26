import type { Category } from '../../types/book';

interface CategoryMeta {
  /** hậu tố class CSS để tô màu theo thể loại */
  tone: 'it' | 'eco' | 'lang';
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  CNTT: { tone: 'it' },
  'Kinh tế': { tone: 'eco' },
  'Ngoại ngữ': { tone: 'lang' },
};
