# Hệ Thống Hỗ Trợ Sự Cố Xe Trên Đường (Road Rescue System)
## Tài Liệu Liên Quan

- [Hướng dẫn cài đặt & cấu trúc dự án](./setup.md)
- [Roadmap các phiên bản tiếp theo](./roadmap.md)
## Lịch Sử Tài Liệu

| Ngày | Phiên bản | Người sửa | Nội dung sửa |
|------|-----------|-----------|--------------|
| 01/04/2026 | v0.1.0 | Văn Thành Đạt | Khởi tạo tài liệu, mô tả tính năng phiên bản đầu |

---

Nền tảng số kết nối người tham gia giao thông gặp sự cố với các đơn vị cứu hộ chuyên nghiệp.

## Công Nghệ Sử Dụng

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO
- **Bản đồ**: Google Maps API / Leaflet

---

## Phiên Bản Hiện Tại: v0.1.0

> Ngày: 01/04/2026 · Người sửa: Văn Thành Đạt · Nội dung: Khởi tạo, xây dựng các chức năng cốt lõi cho 3 nhóm người dùng.

**Người dùng cá nhân:**
- Đăng ký và đăng nhập tài khoản
- Nhập thông tin sự cố và chọn loại dịch vụ
- Xác định vị trí qua GPS hoặc nhập địa chỉ thủ công (cascade: Tỉnh → Quận/Huyện → Xã/Phường)
- Đính kèm 1 ảnh hiện trường
- Xem danh sách công ty cứu hộ kèm giá và đánh giá
- Gửi yêu cầu cứu hộ đến công ty đã chọn
- Theo dõi trạng thái yêu cầu theo thời gian thực
- Hủy yêu cầu (không cần lý do khi chưa xác nhận, cần lý do khi đang xử lý)
- Đánh giá dịch vụ 1-5 sao sau khi hoàn tất
- Đăng và tìm kiếm bài viết hướng dẫn xử lý sự cố cộng đồng

**Công ty cứu hộ:**
- Đăng ký tài khoản doanh nghiệp (chờ Admin duyệt)
- Quản lý thông tin công ty, danh mục dịch vụ và bảng giá
- Quản lý danh sách xe cứu hộ (biển số, loại xe, trạng thái tự động)
- Nhận thông báo yêu cầu mới và xác nhận/từ chối trong 10 phút
- Cung cấp ETA sau khi xác nhận
- Cập nhật trạng thái xử lý và xác nhận hoàn tất kèm thông tin thanh toán
- Chat với khách hàng trong quá trình xử lý
- Phản hồi đánh giá của khách hàng

**Quản trị viên:**
- Đăng nhập bằng tài khoản được seed sẵn, giao diện riêng biệt
- Xác minh và phê duyệt tài khoản công ty cứu hộ
- Quản lý tài khoản người dùng (khóa/mở khóa)
- Kiểm duyệt đánh giá và bài đăng vi phạm
- Xem báo cáo và thống kê hoạt động hệ thống

---


