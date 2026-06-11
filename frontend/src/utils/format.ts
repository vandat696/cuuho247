/**
 * Các hàm format dùng chung toàn app.
 * Import từ đây thay vì viết lại trong từng component.
 */

/**
 * Format ngày giờ đầy đủ (giờ:phút ngày/tháng/năm) theo locale vi-VN.
 * Trả về fallback khi giá trị không hợp lệ.
 */
export const formatDateTime = (dateValue?: string, fallback = 'Chưa rõ thời gian') => {
  if (!dateValue) return fallback;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

/**
 * Format chỉ giờ:phút theo locale vi-VN.
 */
export const formatTimeOnly = (dateValue?: string, fallback = '') => {
  if (!dateValue) return fallback;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Format "X phút trước / X giờ trước / X ngày trước".
 */
export const formatTimeAgo = (dateValue?: string) => {
  if (!dateValue) return 'Vừa xong';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Vừa xong';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} ngày trước`;
};

/**
 * Format số tiền VND.
 */
export const formatPrice = (price: number | null) =>
  price === null ? null : new Intl.NumberFormat('vi-VN').format(price);

/**
 * Format giá dịch vụ dạng "Xđ" hoặc fallback text.
 */
export const formatPriceRange = (
  minPrice: number | null,
  _maxPrice?: number | null,
  fallback = 'Chưa cập nhật giá'
) => {
  if (minPrice !== null) {
    return `${formatPrice(minPrice)}đ`;
  }
  return fallback;
};

/**
 * Format thời gian đến dạng "~X phút" hoặc fallback text.
 */
export const formatEta = (etaMinutes?: number | null, fallback = 'Chưa có thời gian dự kiến') =>
  etaMinutes ? `~${etaMinutes} phút` : fallback;
