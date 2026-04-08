# Road Rescue System - Hệ Thống Cứu Hộ Xe Cộ

Nền tảng số kết nối người tham gia giao thông gặp sự cố với các đơn vị cứu hộ chuyên nghiệp, cung cấp dịch vụ cứu hộ real-time với định vị GPS và chat trực tiếp.

## 📋 Tài Liệu Liên Quan

- [Hướng dẫn cấu trúc & yêu cầu](./setup.md)
- [Roadmap phiên bản tiếp theo](./roadmap.md)

---

## 🚀 Quick Start - Cài Đặt Nhanh

### Yêu cầu

- Node.js v18+
- npm hoặc yarn
- MongoDB Atlas hoặc MongoDB local

### 1️⃣ Tạo file .env

```bash
cp .env.example .env
```

Chỉnh sửa `.env` với:

- `MONGODB_URL`: Connection string MongoDB
- `JWT_SECRET`: Secret key bất kỳ
- `BACKEND_URL`: http://localhost:3000
- `FRONTEND_URL`: http://localhost:5173

### 2️⃣ Cài đặt Backend

```bash
cd backend
npm install
npm run dev
```

✅ Server chạy: http://localhost:3000

### 3️⃣ Cài đặt Frontend (Terminal mới)

```bash
cd frontend
npm install
npm run dev
```

✅ Client chạy: http://localhost:5173

---

## 📦 Tech Stack

| Lớp           | Công Nghệ          | Phiên Bản |
| ------------- | ------------------ | --------- |
| **Frontend**  | React + Vite       | 18 + 5    |
| **Backend**   | Express + Node.js  | 4.18      |
| **Database**  | MongoDB + Mongoose | Atlas     |
| **Real-time** | Socket.IO          | 4.7       |
| **Maps**      | Leaflet            | 1.9       |
| **State**     | Zustand            | 4.4       |
| **Auth**      | JWT + bcryptjs     | -         |
| **Language**  | TypeScript         | -         |

---

## 📁 Cấu Trúc Thư Mục

```
cuuho247/
├── frontend/              # React + Vite App
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   ├── store/        # Zustand state
│   │   ├── types/        # TypeScript types
│   │   ├── constants/    # Constants
│   │   └── App.tsx
│   ├── index.html
│   └── vite.config.ts
│
├── backend/               # Express + Node.js API
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── models/       # Mongoose schemas
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Middleware
│   │   ├── validators/   # Input validation
│   │   ├── websocket/    # Socket.IO handlers
│   │   └── app.ts
│   ├── server.ts
│   └── tsconfig.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔌 API Base

- **Base URL**: http://localhost:3000/api
- **Real-time**: ws://localhost:3000 (Socket.IO)

### Main Namespaces

- `/chat` - Tin nhắn real-time
- `/requests` - Yêu cầu cứu hộ
- `/vehicles` - Tracking xe

---

## 🔐 Roles & Auth

| Role             | Mô tả              |
| ---------------- | ------------------ |
| `user`           | Người dùng cá nhân |
| `rescue_company` | Công ty cứu hộ     |
| `admin`          | Quản trị viên      |

**Authentication**: JWT token in `Authorization: Bearer <token>` header

---

## 📚 Tính Năng Hiện Tại (v0.1.0)

### 👤 Người Dùng Cá Nhân

- ✅ Đăng ký / Đăng nhập
- ✅ Tạo yêu cầu cứu hộ với GPS
- ✅ Xem trạng thái real-time
- ✅ Đánh giá dịch vụ
- ✅ Chat với công ty cứu hộ
- ✅ Tham gia cộng đồng (bài viết, bình luận)

### 🚗 Công Ty Cứu Hộ

- ✅ Đăng ký công ty (chờ duyệt)
- ✅ Quản lý dịch vụ & giá cả
- ✅ Nhận yêu cầu real-time
- ✅ Cập nhật trạng thái xử lý
- ✅ Phản hồi đánh giá

### 👨‍💼 Quản Trị Viên

- ✅ Duyệt công ty cứu hộ
- ✅ Quản lý người dùng
- ✅ Kiểm duyệt nội dung
- ✅ Xem thống kê

---

## 📌 Hướng Dẫn Phát Triển

### Chạy cả 2 services

**Terminal 1 - Backend**:

```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend**:

```bash
cd frontend && npm run dev
```

### Debugging

**ESLint + Type Check**:

```bash
npm run lint
npm run type-check
```

**Build for Production**:

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Database

- Connection string: `.env` → `MONGODB_URL`
- Models: `backend/src/models/`
- Migrations: Tạo new files trong models khi thay đổi schema

---

## 🤝 Collaboration

1. Tạo branch: `git checkout -b feature/your-feature`
2. Commit message: Tuân thủ [Quy chuẩn Commit Message](./COMMIT_CONVENTION.md)
   - Ví dụ: `feat(auth): thêm tính năng đăng nhập bằng Google`
3. Chạy `npm run lint` trước khi push
4. Push và tạo Pull Request

---

## Lịch Sử Tài Liệu

| Ngày       | Phiên bản | Người sửa     | Nội dung sửa                                     |
| ---------- | --------- | ------------- | ------------------------------------------------ |
| 01/04/2026 | v0.1.0    | Văn Thành Đạt | Khởi tạo tài liệu, mô tả tính năng phiên bản đầu |
| -          | v0.2.0    | Team          | Base project setup, configuration files          |

---

## Công Nghệ Sử Dụng

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO
- **Bản đồ**: Leaflet

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
