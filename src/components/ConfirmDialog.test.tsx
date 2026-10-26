import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmProvider, useConfirm } from './ConfirmDialog';

function Demo({ onResult }: { onResult: (confirmed: boolean) => void }) {
  const confirm = useConfirm();
  return (
    <button type="button" onClick={async () => onResult(await confirm({ title: 'Xác nhận trả sách', message: 'Chắc chưa?', confirmText: 'Trả sách' }))}>
      Mở
    </button>
  );
}

const setup = () => {
  const onResult = jest.fn();
  render(
    <ConfirmProvider>
      <Demo onResult={onResult} />
    </ConfirmProvider>,
  );
  return { onResult, user: userEvent.setup() };
};

describe('ConfirmDialog', () => {
  it('trả về true khi bấm nút xác nhận', async () => {
    const { onResult, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Mở' }));
    expect(screen.getByRole('alertdialog')).toHaveTextContent('Xác nhận trả sách');
    await user.click(screen.getByRole('button', { name: 'Trả sách' }));
    expect(onResult).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('trả về false khi bấm Huỷ hoặc nhấn Esc', async () => {
    const { onResult, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Mở' }));
    await user.click(screen.getByRole('button', { name: 'Huỷ' }));
    expect(onResult).toHaveBeenLastCalledWith(false);

    await user.click(screen.getByRole('button', { name: 'Mở' }));
    await user.keyboard('{Escape}');
    expect(onResult).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
