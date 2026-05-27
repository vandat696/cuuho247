import type { RequestStatus } from '@/types/rescue.type';

interface CancelButtonProps {
  status: RequestStatus;
  onCancel: () => void;
}

const CANCELLABLE: RequestStatus[] = ['pending', 'accepted'];

export function CancelButton({ status, onCancel }: CancelButtonProps) {
  const canCancel = CANCELLABLE.includes(status);

  return (
    <button
      type="button"
      className="btn btn--md btn--full btn--cancel"
      onClick={canCancel ? onCancel : undefined}
      disabled={!canCancel}
    >
      Hủy yêu cầu
    </button>
  );
}
