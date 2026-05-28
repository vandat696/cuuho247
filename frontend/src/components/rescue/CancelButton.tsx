import { Button } from '../common/Button';
import type { RequestStatus } from '@/types/rescue.type';

interface CancelButtonProps {
  status: RequestStatus;
  onCancel: () => void;
}

const CANCELLABLE: RequestStatus[] = ['pending'];

export function CancelButton({ status, onCancel }: CancelButtonProps) {
  const canCancel = CANCELLABLE.includes(status);

  return (
    <Button
      variant="outline"
      fullWidth
      onClick={canCancel ? onCancel : undefined}
      disabled={!canCancel}
      sx={{
        color: 'var(--clr-error)',
        borderColor: 'var(--clr-error)',
        '&:hover': {
          backgroundColor: 'var(--clr-error-light)',
          borderColor: 'var(--clr-error)',
        },
      }}
    >
      Hủy yêu cầu
    </Button>
  );
}
