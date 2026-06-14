# 📋 Project Progress & Context - cuuho247

**Project Name:** Road Rescue System - Hệ Thống Cứu Hộ Xe Cộ  
**Repository:** https://github.com/vandat696/cuuho247  
**Version:** 2.1.0  
**Last Updated:** 2026-06-12

---

## 📖 Project Overview

Nền tảng số kết nối người tham gia giao thông gặp sự cố với các đơn vị cứu hộ chuyên nghiệp, cung cấp dịch vụ cứu hộ real-time với định vị GPS, chat trực tiếp và hệ thống truyền tin thời gian thực qua WebSockets.

### 🎯 Core Features

- Quản lý yêu cầu cứu hộ thời gian thực (Real-time rescue flow).
- Định vị vị trí và điều hướng dựa trên bản đồ GPS (Goong Maps / Leaflet).
- Kênh chat trực tiếp (Live Chat) giữa khách hàng và đơn vị cứu hộ.
- Đăng ký, xác minh hồ sơ và quản lý đơn vị cứu hộ (Company verification).
- Quản lý danh mục dịch vụ cứu hộ, bảng giá và đội xe cứu hộ.
- Hệ thống báo cáo phân tích chất lượng dịch vụ (Service quality report).
- Không gian tương tác cộng đồng nội bộ dành cho đối tác cứu hộ.
- Hệ thống thông báo đẩy (Notifications) đa luồng.
- Quản trị viên theo dõi hoạt động, kiểm duyệt nội dung và khóa tài khoản vi phạm.

---

## 🛠️ Tech Stack

| Layer                | Technology                        | Version     |
| -------------------- | --------------------------------- | ----------- |
| **Frontend**         | React + TypeScript + Vite         | 18 + 5      |
| **Backend**          | Express.js + Node.js + TypeScript | 4.18        |
| **Database**         | MongoDB + Mongoose                | Atlas/Local |
| **Real-time**        | Socket.IO (WebSockets)            | 4.7+        |
| **Maps**             | Leaflet                           | 1.9+        |
| **State Management** | Zustand                           | 4.4+        |
| **Authentication**   | JWT + bcryptjs                    | -           |
| **UI Framework**     | Material-UI (MUI)                 | 5.15+       |
| **Validation**       | Joi + Zod                         | 18.2 + 4.4  |
| **HTTP Client**      | Axios                             | 1.6+        |
| **Job Queue**        | Bull                              | 4.16+       |
| **File Upload**      | Multer                            | 1.4+        |

---

## 📁 Project Structure

```
cuuho247/
├── backend/                          # Express API Server (Modular & Event-Driven)
│   ├── src/
│   │   ├── modules/                  # Business Logic Modules
│   │   │   ├── admin/                # Admin views, logging, reporting
│   │   │   ├── auth/                 # Multi-role JWT authentication
│   │   │   ├── community/            # Community boards & comment moderation
│   │   │   ├── message/              # User-Company live chat service
│   │   │   ├── notification/         # Unified notification delivery
│   │   │   ├── rescue/               # Customer request & Company handling flows
│   │   │   ├── review/               # Rating and feedback modules
│   │   │   ├── user/                 # Account profile configurations
│   │   │   └── vehicle/              # Fleet management for rescue companies
│   │   │
│   │   ├── shared/                   # Shared configurations & databases
│   │   │   ├── config/               # Incidents configuration & DB connections
│   │   │   ├── constants/            # System-wide roles and configurations
│   │   │   ├── middleware/           # Authentication, authorization, error middlewares
│   │   │   ├── models/               # Unified Mongoose models (Schemas)
│   │   │   └── utils/                # Helpers (JWT, password, upload, geometry utils)
│   │   │
│   │   ├── socket/                   # Central Socket.IO handler
│   │   │   └── index.ts
│   │   │
│   │   ├── app.ts                    # Express app initialization
│   │   ├── routes.ts                 # Aggregated API router definition
│   │   └── server.ts                 # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│
├── frontend/                         # React + Vite Client Application
│   ├── src/
│   │   ├── components/               # UI components categorized by features
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── community/
│   │   │   ├── company/
│   │   │   ├── layout/
│   │   │   ├── map/
│   │   │   ├── notifications/
│   │   │   ├── rescue-company/
│   │   │   └── user/
│   │   ├── pages/                    # Routing page components
│   │   ├── services/                 # Axios-based API services
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── store/                    # Zustand global stores
│   │   ├── types/                    # Common TypeScript type definitions
│   │   ├── constants/                # Front-end static constants
│   │   ├── utils/                    # Utility utilities
│   │   ├── styles/                   # Stylesheets & CSS variables
│   │   ├── assets/                   # Assets (images, icons)
│   │   ├── App.tsx                   # Main App container
│   │   └── main.tsx                  # Client-side entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│
├── docs/                             # Project Documentation
│   └── company-registration.md       # Company registration setup flow
│
├── package.json                      # Monorepo workspace setup
├── release-please-config.json        # Automatic release version configuration
├── CHANGELOG.md                      # Changelog history
├── README.md                         # Main readme file
├── STRUCTURE_SAMPLE.md               # Folder and system architecture guide
└── progress.md                       # This progress tracker file
```

---

## 🚀 Development Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB (Atlas or local instance)
- Git

### Environment Setup

1. **Root Level (.env)**

   ```env
   MONGODB_URL=mongodb+srv://...
   JWT_SECRET=your_secret_key
   BACKEND_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   npm run dev      # Runs Express development server on port 3000
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev      # Runs Vite development client on port 5173
   ```

4. **Root Level (Concurrently)**
   ```bash
   npm run dev      # Concurrently boots up both backend and frontend servers
   ```

---

## 📊 Current Project Status

### ✅ Completed (v2.1.0)

- **Backend Modular Refactoring:** Reorganized backend code from Layer-based structure into highly cohesive modules (`modules/`).
- **Event-Driven Integration:** Implemented Event Emitters and Subscribers (`.subscriber.ts`) to decouple services, optimizing system notifications, real-time broadcasts, and automated updates.
- **Data Access Refactoring (Repository Pattern):** Added dedicated `repository` classes (`.repository.ts`) to isolate Mongoose queries from business services.
- **WebSocket Upgrade:** Completed migration from client-side HTTP polling to standard WebSockets (`Socket.IO`) for tracking active rescue flows and messaging updates.
- **Service Verification Process:** Added features to allow admins to vet, approve, or reject company registrations.
- **Analytics & Report Engine:** Built reports for Admins regarding active requests, service status, and general quality performance indicators.
- **Partner Community Forums:** Added posting, commenting, and message review functions for partner agencies.
- **Unified Notification System:** Enabled real-time notification records and push channels for both individual users and rescue companies.
- **Security Moderation:** Added lock/unlock control configurations for Admin dashboard.
- **Autocomplete & Maps:** Embedded minimap with pin locations and fixed autocomplete issues for Goong search inputs.

---

## 🎯 Important Notes for Future Development

1. **Decoupled Architecture:** When developing new functions, always write logic within its corresponding module folder under `backend/src/modules/`.
2. **Use Repository Pattern:** Avoid direct DB calls inside service layers; use the `.repository.ts` class to run Mongoose queries.
3. **Handle Side-Effects via Events:** Actions that span across multiple modules (e.g., notifying users after status changes or triggering review options) should be handled asynchronously using Event Emitters and Subscribers.
4. **WebSocket namespaces:** The system runs real-time updates via Socket.IO. Refer to the event structure in `backend/src/modules/rescue/rescue.subscriber.ts` when introducing new event listeners.
