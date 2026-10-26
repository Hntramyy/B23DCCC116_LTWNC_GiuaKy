export const CATEGORIES = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  /** số bản còn lại trong thư viện */
  available: number;
}

/** Utility type (Indexed access): kiểu của khoá chính */
export type BookId = Book['id'];

/** Utility type Omit: dữ liệu sách khi chưa có id (seed data) */
export type NewBook = Omit<Book, 'id'>;

/** Utility type Pick: các trường dùng để tìm kiếm theo từ khoá */
export type SearchableFields = Pick<Book, 'title' | 'author'>;

/** Utility type Record: số đầu sách theo từng thể loại */
export type CategoryStats = Record<Category, number>;

export type CategoryFilter = 'ALL' | Category;

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
