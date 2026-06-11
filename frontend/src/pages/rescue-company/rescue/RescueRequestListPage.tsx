import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { UnifiedRequestCard } from '@/components/rescue-company/UnifiedRequestCard';
import { RescueListScaffold } from '@/components/rescue-company/RescueCompanyRequestShared';
import { companyRescueService } from '@/services/company-rescue.service';
type RequestStatus = 'pending' | 'active' | 'completed' | 'canceled';

export default function RescueRequestListPage() {
  const navigate = useNavigate();
  const { status } = useParams<{ status: RequestStatus }>();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [status]);

  const fetchRequests = async () => {
    if (!status) return;
    setLoading(true);
    try {
      let response;
      switch (status) {
        case 'pending':
          response = await companyRescueService.getCompanyPendingRequests();
          break;
        case 'active':
          response = await companyRescueService.getCompanyActiveRequests();
          break;
        case 'completed':
          response = await companyRescueService.getCompanyCompletedRequests();
          break;
        case 'canceled':
          response = await companyRescueService.getCompanyCanceledRequests();
          break;
        default:
          throw new Error('Invalid status');
      }

      if (response.status === 'success') {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Không thể tải dữ liệu yêu cầu', { id: 'fetch-requests-error' });
    } finally {
      setLoading(false);
    }
  };

  const getPageConfig = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return { title: 'Yêu cầu đang chờ', emptyMessage: 'Chưa có yêu cầu đang chờ' };
      case 'active':
        return { title: 'Nhiệm vụ đang thực hiện', emptyMessage: 'Chưa có nhiệm vụ đang thực hiện' };
      case 'completed':
        return { title: 'Đã hoàn thành', emptyMessage: 'Chưa có nhiệm vụ đã hoàn thành' };
      case 'canceled':
        return { title: 'Đã hủy', emptyMessage: 'Chưa có nhiệm vụ đã hủy' };
      default:
        return { title: 'Danh sách', emptyMessage: 'Trống' };
    }
  };

  if (!status) return null;

  const config = getPageConfig(status);

  return (
    <RescueListScaffold
      title={config.title}
      totalLabel="nhiệm vụ"
      emptyMessage={config.emptyMessage}
      loading={loading}
      requests={requests}
      renderRequest={(request) => (
        <UnifiedRequestCard
          key={request._id}
          request={request}
          status={status}
          onViewDetail={() => navigate(`/company/rescue/${status}/${request._id}`)}
        />
      )}
    />
  );
}
