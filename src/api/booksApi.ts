import type { ApiResponse } from '../types/api';
import type { Book, NewBook } from '../types/book';

const SEED: ReadonlyArray<NewBook> = [
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'CNTT', year: 2008, available: 3 },
  { title: 'Lập trình TypeScript', author: 'Nguyễn Văn An', category: 'CNTT', year: 2022, available: 2 },
  { title: 'Cấu trúc dữ liệu và giải thuật', author: 'Đỗ Xuân Lôi', category: 'CNTT', year: 2015, available: 1 },
  { title: 'Design Patterns', author: 'Erich Gamma', category: 'CNTT', year: 1994, available: 0 },
  { title: 'Kinh tế vi mô', author: 'N. Gregory Mankiw', category: 'Kinh tế', year: 2018, available: 4 },
  { title: 'Kinh tế vĩ mô', author: 'N. Gregory Mankiw', category: 'Kinh tế', year: 2019, available: 2 },
  { title: 'Nguyên lý kế toán', author: 'Trần Thị Bình', category: 'Kinh tế', year: 2020, available: 1 },
  { title: 'English Grammar in Use', author: 'Raymond Murphy', category: 'Ngoại ngữ', year: 2019, available: 5 },
  { title: 'Minna no Nihongo', author: '3A Corporation', category: 'Ngoại ngữ', year: 2012, available: 2 },
  { title: 'IELTS Writing Skills', author: 'Lê Thu Hà', category: 'Ngoại ngữ', year: 2021, available: 0 },
];

export interface FetchBooksOptions {
  /** true để giả lập API thất bại */
  shouldFail?: boolean;
  /** độ trễ giả lập (ms) */
  delay?: number;
}

/** API giả lập: trả về Promise, trễ 500ms bằng setTimeout */
export function fetchBooksApi({ shouldFail = false, delay = 500 }: FetchBooksOptions = {}): Promise<ApiResponse<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({ ok: false, error: 'Không thể tải danh sách sách. Vui lòng thử lại.' });
        return;
      }
      resolve({
        ok: true,
        data: SEED.map((book, index) => ({ ...book, id: `b${index + 1}` })),
      });
    }, delay);
  });
}
