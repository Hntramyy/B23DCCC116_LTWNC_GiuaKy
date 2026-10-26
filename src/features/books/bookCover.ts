import type { CSSProperties } from 'react';
import type { BookId } from '../../types/book';

/** Bảng màu vải bìa sách — trầm, giống bìa cứng thật */
const COVER_COLORS = [
  '#1f3b4d', // xanh than
  '#5b2333', // đỏ rượu
  '#2f4a3a', // xanh rêu
  '#8a5a2b', // vàng đất
  '#3d3a5c', // chàm
  '#6b2f1a', // nâu gạch
  '#2b2a28', // than chì
  '#4a5d4f', // xanh xám
  '#7a6542', // kaki
] as const;

const VARIANTS = ['classic', 'band', 'modern'] as const;

export type CoverVariant = (typeof VARIANTS)[number];

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Mỗi cuốn sách có màu + kiểu bìa cố định, suy ra từ id */
export function getCover(id: BookId): { variant: CoverVariant; style: CSSProperties } {
  const h = hash(id);
  return {
    variant: VARIANTS[h % VARIANTS.length],
    style: { '--cover': COVER_COLORS[h % COVER_COLORS.length] } as CSSProperties,
  };
}
