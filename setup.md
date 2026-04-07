# Hướng Dẫn Cài Đặt & Cấu Trúc Dự Án

## Lịch Sử Tài Liệu

| Ngày | Phiên bản | Người sửa | Nội dung sửa |
|------|-----------|-----------|--------------|
| 07/04/2026 | v0.1.0 | — | Khởi tạo tài liệu |

---

## Yêu Cầu Môi Trường

- Node.js >= 18
- npm >= 9
- Tài khoản MongoDB Atlas

---

## Cài Đặt

```bash
# Clone repository
git clone <repo-url>
cd road-rescue-system

# Cài đặt dependencies cho backend
cd backend
npm install

# Cài đặt dependencies cho frontend
cd ../frontend
npm install
```

## Cấu Hình Môi Trường

Tạo file `.env` trong thư mục `backend`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Chạy Dự Án

```bash
# Chạy backend (từ thư mục backend)
npm run dev

# Chạy frontend (từ thư mục frontend)
npm run dev
```

---

## Cấu Trúc Dự Án

```
road-rescue-system/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── pages/          # Các trang chính
│   │   ├── components/     # Component dùng chung
│   │   ├── services/       # Gọi API
│   │   └── assets/
│   └── vite.config.js
├── backend/                # Node.js + Express
│   ├── routes/             # Định nghĩa API routes
│   ├── models/             # MongoDB schemas
│   ├── controllers/        # Xử lý logic
│   └── middleware/         # Auth, error handling
├── readme.md
├── setup.md
└── roadmap.md
```
