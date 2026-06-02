// Danh sách các khu vực hoạt động cho công ty cứu hộ
export const SERVICE_AREAS = [
  // Thành phố lớn
  { id: 'ha_noi', label: 'Hà Nội' },
  { id: 'tp_hcm', label: 'TP.Hồ Chí Minh' },
  { id: 'hai_phong', label: 'Hải Phòng' },
  { id: 'da_nang', label: 'Đà Nẵng' },
  { id: 'can_tho', label: 'Cần Thơ' },
  { id: 'hue', label: 'Huế' },
  // Tây Bắc
  { id: 'lai_chau', label: 'Lai Châu' },
  { id: 'dien_bien', label: 'Điện Biên' },
  { id: 'son_la', label: 'Sơn La' },
  // Đông Bắc
  { id: 'lang_son', label: 'Lạng Sơn' },
  { id: 'cao_bang', label: 'Cao Bằng' },
  { id: 'tuyen_quang', label: 'Tuyên Quang' },
  { id: 'lao_cai', label: 'Lào Cai' },
  { id: 'thai_nguyen', label: 'Thái Nguyên' },
  { id: 'phu_tho', label: 'Phú Thọ' },
  { id: 'bac_ninh', label: 'Bắc Ninh' },
  { id: 'hung_yen', label: 'Hưng Yên' },
  { id: 'quang_ninh', label: 'Quảng Ninh' },
  // Đông Nam Bộ
  { id: 'ninh_binh', label: 'Ninh Bình' },
  { id: 'thanh_hoa', label: 'Thanh Hoá' },
  // Bắc Trung Bộ
  { id: 'nghe_an', label: 'Nghệ An' },
  { id: 'ha_tinh', label: 'Hà Tĩnh' },
  // Duyên Hải Trung Bộ
  { id: 'quang_tri', label: 'Quảng Trị' },
  { id: 'quang_ngai', label: 'Quảng Ngãi' },
  // Tây Nguyên
  { id: 'gia_lai', label: 'Gia Lai' },
  { id: 'dak_lak', label: 'Đắk Lắk' },
  { id: 'lam_dong', label: 'Lâm Đồng' },
  // Nam Trung Bộ
  { id: 'khanh_hoa', label: 'Khánh Hòa' },
  // Đông Nam Bộ
  { id: 'dong_nai', label: 'Đồng Nai' },
  { id: 'tay_ninh', label: 'Tây Ninh' },
  // Đồng Bằng Sông Cửu Long
  { id: 'an_giang', label: 'An Giang' },
  { id: 'dong_thap', label: 'Đồng Tháp' },
  { id: 'vinh_long', label: 'Vĩnh Long' },
  { id: 'ca_mau', label: 'Cà Mau' },
];

export type ServiceAreaId = (typeof SERVICE_AREAS)[number]['id'];
