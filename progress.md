# 📋 Project Progress & Context - cuuho247

**Project Name:** Road Rescue System - Hệ Thống Cứu Hộ Xe Cộ  
**Repository:** https://github.com/vandat696/cuuho247  
**Version:** 1.0.0  
**Last Updated:** 2026-05-22

---

## 📖 Project Overview

Nền tảng số kết nối người tham gia giao thông gặp sự cố với các đơn vị cứu hộ chuyên nghiệp, cung cấp dịch vụ cứu hộ real-time với định vị GPS và chat trực tiếp.

### 🎯 Core Features

- Real-time rescue request management
- GPS-based location tracking
- Live chat between users and rescue companies
- Rescue company registration & management
- Service category management
- Vehicle information storage
- Admin logging and monitoring
- Community posts & reviews
- Notifications system

---

## 🛠️ Tech Stack

| Layer                | Technology                        | Version     |
| -------------------- | --------------------------------- | ----------- |
| **Frontend**         | React + TypeScript + Vite         | 18 + 5      |
| **Backend**          | Express.js + Node.js + TypeScript | 4.18        |
| **Database**         | MongoDB + Mongoose                | Atlas/Local |
| **Real-time**        | Socket.IO                         | 4.7+        |
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
├── backend/                          # Express API Server
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.model.ts
│   │   │   ├── Company.model.ts
│   │   │   ├── Service.model.ts
│   │   │   ├── ServiceCategory.model.ts
│   │   │   ├── RescueRequest.model.ts
│   │   │   ├── Vehicle.model.ts
│   │   │   ├── Message.model.ts
│   │   │   ├── Notification.model.ts
│   │   │   ├── Review.model.ts
│   │   │   ├── CommunityPost.model.ts
│   │   │   ├── Admin.model.ts
│   │   │   ├── AdminLog.model.ts
│   │   │   ├── index.ts
│   │   │   └── shared.ts
│   │   ├── controllers/              # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── company.controller.ts
│   │   │   ├── rescue.controller.ts
│   │   │   ├── service.controller.ts
│   │   │   ├── serviceCategory.controller.ts
│   │   │   └── vehicle.controller.ts
│   │   ├── services/                 # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── rescue.service.ts
│   │   │   ├── service.service.ts
│   │   │   └── vehicle.service.ts
│   │   ├── repositories/             # Data layer
│   │   │   ├── company.repository.ts
│   │   │   ├── service.repository.ts
│   │   │   ├── serviceCategory.repository.ts
│   │   │   ├── user.repository.ts
│   │   │   └── vehicle.repository.ts
│   │   ├── routes/                   # API endpoints
│   │   │   ├── auth.route.ts
│   │   │   ├── company.route.ts
│   │   │   ├── rescue.route.ts
│   │   │   ├── service.route.ts
│   │   │   ├── serviceCategory.route.ts
│   │   │   ├── vehicle.routes.ts
│   │   │   └── index.ts
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── authorize.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── validators/               # Input validation
│   │   │   ├── auth.validator.ts
│   │   │   ├── common.validator.ts
│   │   │   ├── service.validator.ts
│   │   │   └── vehicle.validator.ts
│   │   ├── websocket/                # Socket.IO handlers
│   │   │   ├── handlers/
│   │   │   └── middleware/
│   │   ├── utils/                    # Utility functions
│   │   │   ├── apiError.util.ts
│   │   │   ├── jwt.util.ts
│   │   │   ├── password.util.ts
│   │   │   └── upload.util.ts
│   │   ├── constants/                # Constants
│   │   │   └── serviceAreas.ts
│   │   ├── jobs/                     # Background jobs
│   │   ├── types/                    # TypeScript types
│   │   ├── uploads/                  # File uploads storage
│   │   ├── scripts/                  # Scripts
│   │   │   └── seed.ts               # Database seeding
│   │   ├── __tests__/                # Tests
│   │   ├── app.ts                    # Express app configuration
│   │   └── server.ts                 # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                         # Compiled output (build)
│
├── frontend/                         # React + Vite Application
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── community/
│   │   │   ├── company/
│   │   │   ├── layout/
│   │   │   ├── location/
│   │   │   ├── map/
│   │   │   ├── notifications/
│   │   │   ├── rescue/
│   │   │   ├── rescue-company/
│   │   │   └── user/
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API services
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── store/                    # Zustand state management
│   │   ├── types/                    # TypeScript types & interfaces
│   │   ├── constants/                # Application constants
│   │   │   └── serviceAreas.ts
│   │   ├── utils/                    # Utility functions
│   │   ├── styles/                   # Global styles
│   │   ├── assets/                   # Images, fonts, etc.
│   │   ├── mocks/                    # Mock data
│   │   ├── __tests__/                # Tests
│   │   ├── App.tsx                   # Root component
│   │   ├── main.tsx                  # Entry point
│   │   ├── theme.ts                  # MUI theme configuration
│   │   ├── index.css                 # Global CSS
│   │   └── vite-env.d.ts             # Vite type definitions
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── dist/                         # Build output
│
├── docs/                             # Documentation
│   ├── company-registration.md       # Company registration guide
│   └── (other docs)
│
├── package.json                      # Root package.json (monorepo config)
├── tsconfig.json                     # Root TypeScript config
├── eslint.config.mjs                 # ESLint configuration
├── commitlint.config.js              # Commitlint configuration
├── release-please-config.json        # Release automation config
├── CHANGELOG.md                      # Version history
├── COMMIT_CONVENTION.md              # Git commit conventions
├── readme.md                         # Project README
├── STRUCTURE_SAMPLE.md               # Project structure sample
└── progress.md                       # This file
```

---

## 🚀 Development Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB (Atlas or local)
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
   npm run dev      # Development server on :3000
   npm run build    # Production build
   npm run seed     # Seed database
   npm run lint     # Run ESLint
   npm run type-check  # TypeScript check
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev      # Development server on :5173
   npm run build    # Production build
   npm run preview  # Preview build
   npm run lint     # Run ESLint
   npm run type-check  # TypeScript check
   ```

4. **Root Level (Monorepo)**
   ```bash
   npm run dev      # Run both backend & frontend concurrently
   npm run build    # Build both
   ```

---

## 📝 Git Conventions (Conventional Commits)

### Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Type Categories

| Type         | Purpose                 | Example                                  |
| ------------ | ----------------------- | ---------------------------------------- |
| **feat**     | New feature             | `feat(auth): add Google login`           |
| **fix**      | Bug fix                 | `fix(api): resolve GPS coordinate issue` |
| **docs**     | Documentation           | `docs: update setup guide`               |
| **style**    | Code formatting         | `style: format code in services`         |
| **refactor** | Code restructuring      | `refactor(models): improve schema reuse` |
| **perf**     | Performance improvement | `perf: optimize database queries`        |
| **test**     | Tests                   | `test: add auth service tests`           |
| **build**    | Build system            | `build: update dependencies`             |
| **ci**       | CI/CD config            | `ci: add GitHub Actions workflow`        |
| **chore**    | Maintenance             | `chore: configure ESLint`                |
| **revert**   | Revert commit           | `revert: undo previous changes`          |

### Scope Examples

`auth`, `api`, `ui`, `database`, `frontend`, `backend`, `models`, `services`

---

## 📊 Current Project Status

### ✅ Completed (v1.1.0)

- Backend API structure with Express + TypeScript
- All Mongoose models initialized & enhanced
- Frontend components framework with MUI
- Authentication system (JWT + bcryptjs, v1.0.0)
- Service CRUD operations (v1.1.0)
- Rescue request search (v1.1.0)
- Company profile management (v1.1.0)
- Route setup (auth, company, service, rescue, vehicle)
- Database configuration
- Middleware setup (auth, authorization, error handling)
- Input validation (Joi, Zod)
- MUI-based UI components
- Maps integration (Leaflet + Goong API)
- Address autocomplete feature
- Repository pattern for data layer
- Release-please automation

### 🔄 In Progress (v1.2.0-beta)

- Company registration with file upload
- Company location selection on map
- Service areas configuration
- Address handling improvements
- Branch: `feat/company-rescue`

### 📋 Features in Detail

#### Backend Modules

**Auth Module**

- Login/Register endpoints
- JWT token generation & validation
- Password hashing with bcryptjs
- Role-based access control

**Company Module**

- Company registration & management
- Company profile management
- Service management for companies
- Rescue team management

**Service Module**

- Service CRUD operations
- Service category management
- Service area configuration

**Rescue Module**

- Rescue request creation
- Rescue request tracking
- Real-time status updates via Socket.IO
- GPS tracking integration

**Vehicle Module**

- Vehicle information storage
- Vehicle type management
- Service history

#### Frontend Pages/Components

- Authentication pages (login, register)
- Company dashboard
- Rescue request pages
- Map view with location tracking
- Chat interface
- Notification center
- Community/review section
- Admin panel
- User profile

---

## 🔌 API & WebSocket Architecture

### Main API Endpoints (Backend Routes)

- `/api/auth/*` - Authentication endpoints
- `/api/companies/*` - Company management
- `/api/services/*` - Service management
- `/api/service-categories/*` - Category management
- `/api/rescue-requests/*` - Rescue operations
- `/api/vehicles/*` - Vehicle management

### Real-time Communication (Socket.IO)

- Chat messages between users and companies
- Live rescue request status updates
- Notifications
- Location tracking updates

---

## 📦 Key Dependencies

### Backend Core

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `joi` / `zod` - Input validation
- `multer` - File upload handling
- `bull` - Job queue

### Frontend Core

- `react` - UI library
- `zustand` - State management
- `react-router-dom` - Routing
- `axios` - HTTP client
- `socket.io-client` - WebSocket client
- `leaflet` / `react-leaflet` - Maps
- `@mui/material` - UI components
- `react-hot-toast` - Notifications

---

## 🎯 Important Notes for Future Development

1. **Database**: Uses MongoDB with Mongoose ORM. Connection URL in `.env`
2. **Authentication**: JWT-based with role roles (admin, company, user)
3. **Real-time**: Socket.IO for live features (chat, notifications, tracking)
4. **File Uploads**: Multer configured in `utils/upload.util.ts`
5. **Location**: Leaflet maps with geocoding via leaflet-geosearch
6. **Validation**: Multiple validators - use Joi for backend, custom for frontend
7. **Error Handling**: Custom ApiError utility in `utils/apiError.util.ts`
8. **State Management**: Zustand stores for frontend (reactive, lightweight)
9. **Environment**: Use `.env` file (copy from `.env.example`)
10. **Type Safety**: Full TypeScript throughout both frontend and backend
11. **Git Hooks**: Husky + commitlint enforce conventional commits
12. **Release Automation**: release-please handles versioning from commits

---

## 🔧 Quick Commands Reference

```bash
# Development
npm run dev                    # Start both backend and frontend
cd backend && npm run dev      # Start backend only
cd frontend && npm run dev     # Start frontend only

# Building
npm run build                  # Build both
cd backend && npm run build    # Build backend
cd frontend && npm run build   # Build frontend

# Code Quality
cd backend && npm run lint     # Lint backend
cd frontend && npm run lint    # Lint frontend
npm run type-check             # TypeScript check

# Database
cd backend && npm run seed     # Seed test data

# Production
npm start (from backend)       # Run production backend
npm run preview (from frontend) # Preview production build
```

---

## 📞 Key Contacts & Resources

- **GitHub**: https://github.com/vandat696/cuuho247
- **MongoDB**: Atlas connection string in `.env`
- **Docs**: Check `./docs/` folder for detailed documentation

---

## 📝 Last Updated

- **Date**: May 22, 2026
- **Current Version**: v1.2.0-beta (in development)
- **Current Branch**: feat/company-rescue
- **Status**: Active Development
- **Release Details**: See version history in [readme.md](./readme.md#-release-history--versioning)

---

## 📚 Documentation Files

- **[progress.md](./progress.md)** - This file (project overview & progress)
- **[readme.md](./readme.md)** - Project README with version history & quick start
- **[CHANGELOG.md](./CHANGELOG.md)** - Detailed release notes by version
- **[COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md)** - Git commit standards
