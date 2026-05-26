import { useState } from 'react';

interface CancelRequestSheetProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const PRESET_REASONS = ['Tôi tự xử lý được rồi', 'Chọn nhầm dịch vụ', 'Tìm được đơn vị khác', 'Thay đổi kế hoạch'];

export function CancelRequestSheet({ isOpen, isLoading = false, onClose, onConfirm }: CancelRequestSheetProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: string) => {
    setReason(preset);
    setError('');
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do hủy');
      return;
    }
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="sheet-overlay" onClick={handleClose} />

      {/* Sheet */}
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="sheet__handle" />

        <h2 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--sp-2)' }}>Hủy yêu cầu</h2>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)', marginBottom: 'var(--sp-4)' }}>
          Vui lòng cho chúng tôi biết lý do bạn hủy yêu cầu
        </p>

        {/* Preset reasons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
          {PRESET_REASONS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              style={{
                padding: '6px var(--sp-3)',
                borderRadius: 'var(--r-full)',
                border: `1.5px solid ${reason === preset ? 'var(--clr-navy)' : 'var(--clr-border)'}`,
                background: reason === preset ? 'var(--clr-navy)' : 'transparent',
                color: reason === preset ? 'var(--clr-text-inverse)' : 'var(--clr-text-sub)',
                fontSize: 'var(--fs-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Custom reason */}
        <div className="input-group" style={{ marginBottom: 'var(--sp-4)' }}>
          <label className="input-label">Hoặc nhập lý do khác</label>
          <textarea
            className={`input-field input-field--textarea ${error ? 'input-field--error' : ''}`}
            placeholder="Nhập lý do hủy..."
            value={reason}
            rows={3}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError('');
            }}
          />
          {error && <span className="input-error">{error}</span>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <button
            type="button"
            className="btn btn--md btn--full btn--primary"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? <span className="btn__spinner" /> : 'Xác nhận hủy'}
          </button>
          <button type="button" className="btn btn--md btn--full btn--ghost" onClick={handleClose} disabled={isLoading}>
            Giữ lại yêu cầu
          </button>
        </div>
      </div>
    </>
  );
}
