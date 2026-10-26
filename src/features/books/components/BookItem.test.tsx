import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Book } from '../../../types/book';
import { BookItem } from './BookItem';

const book: Book = {
  id: 'b42',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  category: 'CNTT',
  year: 2008,
  available: 2,
};

const setup = (overrides: Partial<Book> = {}, isBorrowed = false) => {
  const onBorrow = jest.fn();
  const onReturn = jest.fn();
  render(<BookItem book={{ ...book, ...overrides }} isBorrowed={isBorrowed} onBorrow={onBorrow} onReturn={onReturn} />);
  return { onBorrow, onReturn };
};

describe('BookItem', () => {
  it('hiển thị đúng thông tin sách', () => {
    setup();
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText(/Robert C\. Martin/)).toBeInTheDocument();
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    expect(screen.getByText(/2008/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('click "Mượn" gọi onBorrow với đúng id', async () => {
    const user = userEvent.setup();
    const { onBorrow } = setup();
    await user.click(screen.getByRole('button', { name: 'Mượn' }));
    expect(onBorrow).toHaveBeenCalledTimes(1);
    expect(onBorrow).toHaveBeenCalledWith('b42');
  });

  it('nút "Mượn" bị vô hiệu hoá khi sách đã hết bản', async () => {
    const user = userEvent.setup();
    const { onBorrow } = setup({ available: 0 });
    const button = screen.getByRole('button', { name: 'Mượn' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onBorrow).not.toHaveBeenCalled();
  });

  it('sách đang mượn hiển thị nút "Trả" và gọi onReturn với đúng id', async () => {
    const user = userEvent.setup();
    const { onReturn } = setup({}, true);
    expect(screen.queryByRole('button', { name: 'Mượn' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Trả' }));
    expect(onReturn).toHaveBeenCalledWith('b42');
  });
});
