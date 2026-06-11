import { AuditLog } from '@/services/admin.service';
import AuditLogHistory from './AuditLogHistory';

interface CompanyLogHistoryProps {
  logs: AuditLog[];
}

export const CompanyLogHistory = ({ logs }: CompanyLogHistoryProps) => {
  return <AuditLogHistory logs={logs} />;
};
