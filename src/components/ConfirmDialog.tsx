import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ReturnIcon } from './icons';

export interface ConfirmOptions {
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

interface ConfirmDialogProps {
  options: ConfirmOptions;
  onClose: (confirmed: boolean) => void;
}

function ConfirmDialog({ options, onClose }: ConfirmDialogProps) {
  const { title, message, confirmText = 'Xác nhận', cancelText = 'Huỷ' } = options;
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    // focus nút "Huỷ" để lỡ nhấn Enter cũng không thực hiện thao tác
    cancelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={() => onClose(false)}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-icon">
            <ReturnIcon width={18} height={18} />
          </span>
          <h2 id={titleId} className="modal-title">
            {title}
          </h2>
        </div>
        <div id={descId} className="modal-message">
          {message}
        </div>
        <div className="modal-actions">
          <button ref={cancelRef} type="button" className="btn btn-secondary" onClick={() => onClose(false)}>
            {cancelText}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onClose(true)}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>(
    (opts) =>
      new Promise<boolean>((resolve) => {
        resolverRef.current?.(false); // huỷ hộp thoại cũ nếu còn mở
        resolverRef.current = resolve;
        setOptions(opts);
      }),
    [],
  );

  const handleClose = useCallback((confirmed: boolean) => {
    resolverRef.current?.(confirmed);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && <ConfirmDialog options={options} onClose={handleClose} />}
    </ConfirmContext.Provider>
  );
}

/** Mở hộp thoại xác nhận, trả về Promise<boolean> (true = người dùng đồng ý) */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm phải được dùng bên trong <ConfirmProvider>');
  }
  return ctx;
}
