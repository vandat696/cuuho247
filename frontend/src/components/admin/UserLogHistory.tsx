import { AuditLog } from '@/services/admin.service';
import AuditLogHistory from './AuditLogHistory';

interface UserLogHistoryProps {
  logs: AuditLog[];
}

export const UserLogHistory = ({ logs }: UserLogHistoryProps) => {
  return <AuditLogHistory logs={logs} />;
};
