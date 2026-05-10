// Danh sách các khu vực hoạt động cho công ty cứu hộ
export const SERVICE_AREAS = [
  { id: 'tp_hcm', label: 'TP.Hồ Chí Minh' },
  { id: 'can_tho', label: 'Cần Thơ' },
  { id: 'hai_phong', label: 'Hải Phòng' },
  { id: 'da_nang', label: 'Đà Nẵng' },
  { id: 'ha_noi', label: 'Hà Nội' },
];

export type ServiceAreaId = typeof SERVICE_AREAS[number]['id'];
