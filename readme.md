# Road Rescue System - Hệ Thống Cứu Hộ Xe Cộ

Nền tảng số kết nối người tham gia giao thông gặp sự cố với các đơn vị cứu hộ chuyên nghiệp, cung cấp dịch vụ cứu hộ real-time với định vị GPS, chat trực tiếp và quy trình xử lý theo vai trò.

**Phiên bản hiện tại:** v1.1.0

**GitHub Releases:** https://github.com/vandat696/cuuho247/releases

## 📋 Tài Liệu Liên Quan

- [Hướng dẫn cấu trúc & yêu cầu](./setup.md)
- [Roadmap phiên bản tiếp theo](./roadmap.md)
- [Đăng ký tài khoản Công ty](./docs/company-registration.md)

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

| Lớp              | Công Nghệ               | Phiên Bản       |
| ---------------- | ----------------------- | --------------- |
| **Frontend**     | React + TypeScript      | 18.2.0 + 5.2    |
| **Frontend Dev** | Vite                    | 5.0.0           |
| **Backend**      | Express + TypeScript    | 4.18.2 + 5.2    |
| **Database**     | MongoDB + Mongoose      | 8.0.3           |
| **Real-time**    | Socket.IO               | 4.7.2           |
| **Maps**         | Leaflet + React Leaflet | 1.9.0 + 4.2.0   |
| **UI Framework** | Material-UI (MUI)       | 5.15.10         |
| **State Mgmt**   | Zustand                 | 4.4.0           |
| **Validation**   | Joi + Zod               | 17.11.0 + 4.4.3 |
| **HTTP Client**  | Axios                   | 1.6.0           |
| **Auth**         | JWT + bcryptjs          | 9.0.2 + 2.4.3   |
| **File Upload**  | Multer                  | 1.4.5-lts.1     |
| **Job Queue**    | Bull                    | 4.16.5          |

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

## 📚 Tính Năng Hiện Tại (v1.1.0)

### 👤 Người Dùng Cá Nhân

- ✅ Đăng ký / Đăng nhập (v1.0.0)
- ✅ Tạo yêu cầu cứu hộ với GPS (v1.1.0)
- ✅ Xem trạng thái real-time (v1.1.0)
- ✅ Đánh giá dịch vụ (v1.1.0)
- ✅ Chat với công ty cứu hộ (v1.x - coming soon)
- ✅ Tham gia cộng đồng (v1.x - coming soon)
- ✅ Tìm kiếm yêu cầu cứu hộ gần đó (v1.1.0)
- ✅ Quản lý thông tin xe (v1.0.0)
- ✅ Thông báo real-time (v2.0.0 - coming soon)

### 🚗 Công Ty Cứu Hộ

- ✅ Đăng ký công ty (v1.0.0)
- ✅ Đăng nhập & quản lý tài khoản (v1.0.0)
- 🔄 Lựa chọn vị trí công ty trên bản đồ (v1.2.0 - in progress)
- ✅ Quản lý dịch vụ & giá cả (v1.1.0)
- ✅ Quản lý danh mục dịch vụ (v1.1.0)
- ✅ Nhận yêu cầu real-time (v1.x - coming soon)
- ✅ Cập nhật trạng thái xử lý (v1.x - coming soon)
- ✅ Dashboard công ty (v1.x - coming soon)
- 🔄 Quản lý độc quyền dịch vụ (v1.2.0 - in progress)

### 👨‍💼 Quản Trị Viên

- ✅ Theo dõi toàn bộ hoạt động hệ thống (v1.0.0)
- ✅ Duyệt đơn đăng ký công ty (v1.0.0)
- ✅ Quản lý danh mục dịch vụ (v1.1.0)
- ✅ Xem lịch sử đăng nhập & hoạt động (v1.0.0)

---

## 🚀 Release Notes v1.1.0

Bản phát hành này tập trung vào luồng xác thực, khởi tạo dữ liệu cốt lõi và hoàn thiện các thành phần nền tảng cho frontend/backend.

### Nổi bật

- Multi-role authentication bằng JWT.
- Bổ sung file cấu hình môi trường mẫu.
- Chuẩn hóa validation cho mật khẩu.
- Đồng bộ phiên bản package và changelog cho quy trình release-please.

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

## � Release History & Versioning

### v1.1.0 - Service & Rescue Features Release ✅

**Release Date:** 2026-05-13  
**Status:** Stable

**Key Features:**

- ✅ Service CRUD operations
- ✅ Service category management
- ✅ Rescue request search functionality
- ✅ Company profile (read/write)
- ✅ Rescue service refactoring (Repository pattern)
- ✅ Input validation enhancement (Joi + Zod)
- ✅ Address autocomplete (Goong API integration)
- ✅ Mini-map feature

**Improvements:**

- 🔧 Refactored rescue service architecture
- 🔧 Enhanced password validation
- 🔧 Improved UI components (category, borders)

**Tag:** `cuuho247-v1.1.0`

---

### v1.0.0 - Authentication & Authorization Release ✅

**Release Date:** 2026-05-10  
**Status:** Stable

**Key Features:**

- ✅ Multi-role authentication system (user, rescue_company, admin)
- ✅ JWT-based authentication
- ✅ Login & Registration UI (Frontend)
- ✅ Auth APIs with global error handling
- ✅ Password validation & security
- ✅ Vehicle management foundation
- ✅ Custom ApiError utility
- ✅ Release-please workflow setup

**Tags:**

- `road-rescue-backend-v1.0.0`
- `road-rescue-frontend-v1.0.0`
- `cuuho247-v1.0.0`

---

### v0.1.0 - Initial Setup & Base Infrastructure ✅

**Release Date:** 2026-04-27  
**Status:** Archived

**Key Features:**

- ✅ Project setup with TypeScript, Express, React, Vite
- ✅ MongoDB + Mongoose models initialization
- ✅ Frontend component & layout foundation
- ✅ Tailwind CSS → MUI migration
- ✅ Environment configuration (.env.example)

**Tag:** `cuuho247-v0.1.0`

---

### v1.2.0 - Company Registration Enhancement 🚀

**Status:** In Development (`feat/company-rescue` branch)  
**Expected Release:** 2026-05-20+

**Features in Progress:**

- 🔄 Company registration with file upload
- 🔄 Company location selection on map
- 🔄 Service area management
- 🔄 Address handling improvements

**Completed So Far:**

- ✅ Company registration flow
- ✅ Map-based location selection
- ✅ Service areas list configuration
- ✅ Address handling & placeholder texts
- ✅ AddressAutocomplete component refinement

**Estimated Tag:** `cuuho247-v1.2.0`

---

### Future Versions

**v1.3.0** - Notifications & Real-time Features

- Socket.IO integration
- Real-time notifications
- Live chat system
- Request status tracking

**v2.0.0** - Advanced Features

- Payment integration
- Advanced analytics
- Community features
- Reviews & ratings system
- Admin dashboard enhancements

---

## 📞 Thông Tin Liên Hệ & Tài Liệu

- **Repository**: https://github.com/vandat696/cuuho247
- **Quy chuẩn Commit**: Xem [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md)
- **Changelog**: Xem [CHANGELOG.md](./CHANGELOG.md)
- **Project Progress**: Xem [progress.md](./progress.md)
