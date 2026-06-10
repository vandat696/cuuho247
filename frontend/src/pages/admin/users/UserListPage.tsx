import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { UserCard } from '@/components/admin/UserCard';
import { CompanyCard } from '@/components/admin/CompanyCard';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { adminService } from '@/services/admin.service';
import { Company, User } from '@/types/common.type';
import { NAVY } from '@/constants/colors';

const PAGE_SIZE = 15;

export default function UserListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0 = Khách hàng, 1 = Công ty
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Trigger fetch when search query, status filter or tab changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      if (activeTab === 0) {
        fetchUsers(1, search, status, false);
      } else {
        fetchCompanies(1, search, status, false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, status, activeTab]);

  const fetchUsers = async (targetPage: number, currentSearch: string, currentStatus: string, loadMore: boolean) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const statusQuery = currentStatus === 'all' ? undefined : currentStatus;
      const response = await adminService.getUsers(currentSearch, statusQuery, PAGE_SIZE, targetPage);

      if (response.status === 'success') {
        const { users: fetchedUsers, total: fetchedTotal } = response.data;
        if (loadMore) {
          setUsers((prev) => [...prev, ...fetchedUsers]);
        } else {
          setUsers(fetchedUsers);
        }
        setTotal(fetchedTotal);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchCompanies = async (
    targetPage: number,
    currentSearch: string,
    currentStatus: string,
    loadMore: boolean
  ) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const statusQuery = currentStatus === 'all' ? undefined : currentStatus;
      const response = await adminService.getCompanies(currentSearch, statusQuery, PAGE_SIZE, targetPage);

      if (response.status === 'success') {
        const { companies: fetchedCompanies, total: fetchedTotal } = response.data;
        if (loadMore) {
          setCompanies((prev) => [...prev, ...fetchedCompanies]);
        } else {
          setCompanies(fetchedCompanies);
        }
        setTotal(fetchedTotal);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Không thể tải danh sách công ty cứu hộ');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (activeTab === 0) {
      fetchUsers(nextPage, search, status, true);
    } else {
      fetchCompanies(nextPage, search, status, true);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearch('');
    setStatus('all');
    setPage(1);
    setUsers([]);
    setCompanies([]);
    setTotal(0);
  };

  const currentCount = activeTab === 0 ? users.length : companies.length;
  const hasMore = currentCount < total;

  return (
    <AdminLayout title="Quản lý tài khoản" backFallback="/admin/home">
      {/* Toggle Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="secondary"
        sx={{
          mb: 3,
          borderBottom: '1px solid #e5e7eb',
          '& .MuiTab-root': { fontWeight: 700, fontSize: 14, py: 1.5 },
        }}
      >
        <Tab label="Khách hàng" id="tab-customers" />
        <Tab label="Công ty cứu hộ" id="tab-companies" />
      </Tabs>

      {/* Search & Filter Controls */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2, mb: 3 }}>
        <Input
          placeholder={
            activeTab === 0 ? 'Tìm theo tên, email hoặc SĐT...' : 'Tìm theo tên công ty, đại diện, email hoặc SĐT...'
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<SearchIcon sx={{ color: '#9ca3af' }} />}
        />

        <Select
          label="Trạng thái tài khoản"
          value={status}
          onChange={(e) => setStatus(e.target.value as string)}
          options={
            activeTab === 0
              ? [
                  { id: 'all', label: 'Tất cả trạng thái' },
                  { id: 'active', label: 'Hoạt động' },
                  { id: 'locked', label: 'Đã khóa' },
                ]
              : [
                  { id: 'all', label: 'Tất cả trạng thái' },
                  { id: 'active', label: 'Hoạt động' },
                  { id: 'locked', label: 'Đã khóa' },
                  { id: 'pending_verification', label: 'Chờ duyệt' },
                  { id: 'rejected', label: 'Từ chối' },
                ]
          }
        />
      </Box>

      <Typography sx={{ mb: 2, fontSize: 15, fontWeight: 800, color: NAVY }}>Kết quả tìm kiếm ({total})</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : currentCount === 0 ? (
        <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
          <Typography sx={{ fontSize: 14 }}>Không tìm thấy tài khoản nào phù hợp.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pb: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
              gap: 2,
            }}
          >
            {activeTab === 0
              ? users.map((user) => (
                  <UserCard key={user._id} user={user} onClick={() => navigate(`/admin/users/${user._id}`)} />
                ))
              : companies.map((company) => (
                  <CompanyCard
                    key={company._id}
                    company={company}
                    onClick={() => navigate(`/admin/companies/${company._id}/detail`)}
                  />
                ))}
          </Box>

          {hasMore && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: 200 }}>
                <Button variant="outline" fullWidth onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? 'Đang tải thêm...' : 'Xem thêm'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </AdminLayout>
  );
}
