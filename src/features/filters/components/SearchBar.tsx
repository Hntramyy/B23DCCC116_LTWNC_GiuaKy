import { useEffect, useRef, useState } from 'react';
import { CloseIcon, SearchIcon } from '../../../components/icons';
import { useDebounce } from '../../../hooks/useDebounce';
import { useFilterStore } from '../filterStore';

export function SearchBar() {
  const keyword = useFilterStore((s) => s.keyword);
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const [input, setInput] = useState(keyword);
  const debouncedInput = useDebounce(input, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setKeyword(debouncedInput);
  }, [debouncedInput, setKeyword]);

  // đồng bộ khi bộ lọc bị reset từ nơi khác (nút "Xoá bộ lọc")
  useEffect(() => {
    if (keyword === '') setInput('');
  }, [keyword]);

  // phím tắt "/" để focus ô tìm kiếm
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === '/' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="search">
      <SearchIcon className="search-icon" />
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Tìm theo tên sách hoặc tác giả..."
        aria-label="Tìm kiếm sách"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {input ? (
        <button type="button" className="search-clear" aria-label="Xoá từ khoá" onClick={() => setInput('')}>
          <CloseIcon width={16} height={16} />
        </button>
      ) : (
        <kbd className="search-kbd">/</kbd>
      )}
    </div>
  );
}
