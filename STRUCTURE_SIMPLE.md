# 🎯 Cấu Trúc Thư Mục Đơn Giản Cho Sinh Viên

> Phiên bản rút gọn - chỉ những gì cần thiết để bắt đầu code

---

## 📁 Cấu Trúc Cơ Bản

```
cuuho247/
├── frontend/               ← React app (giao diện)
├── backend/                ← Node.js API (backend logic)
├── .env                    ← MongoDB URL & config
├── .gitignore              ← Git ignore file
└── README.md               ← Hướng dẫn project
```

**Thế thôi!** Không cần `shared/`, `docs/`, `config/`, `scripts/`, `docker/`.

---

## 📦 Frontend Folder

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/                 ← UI components dùng chung
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── layout/                 ← Layout (Header, Sidebar...)
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   │
│   │   ├── auth/                   ← Auth components (login, register)
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── user/                   ← User features (Req 1-11)
│   │   │   ├── CreateRequestForm.tsx   (Req 3)
│   │   │   ├── LocationPicker.tsx       (Req 4)
│   │   │   ├── ServiceSelector.tsx      (Req 3)
│   │   │   ├── ImageUpload.tsx          (Req 5)
│   │   │   ├── RescueCompanyList.tsx    (Req 6)
│   │   │   ├── CompanyCard.tsx
│   │   │   ├── RequestStatusTracker.tsx (Req 7)
│   │   │   ├── LiveMap.tsx              (Req 6, 7)
│   │   │   ├── RatingModal.tsx          (Req 10)
│   │   │   └── PostForm.tsx             (Req 11)
│   │   │
│   │   ├── rescue-company/         ← RescueCompany features (Req 12-20)
│   │   │   ├── CompanyProfileForm.tsx   (Req 12, 13)
│   │   │   ├── ServiceManager.tsx       (Req 15)
│   │   │   ├── VehicleManager.tsx       (Req 16)
│   │   │   ├── RequestNotificationList.tsx (Req 17)
│   │   │   ├── RequestActionPanel.tsx   (Req 17)
│   │   │   ├── ETAForm.tsx              (Req 18)
│   │   │   ├── CompletionForm.tsx       (Req 18)
│   │   │   └── RatingReplyForm.tsx      (Req 20)
│   │   │
│   │   ├── admin/                  ← Admin features (Req 21-25)
│   │   │   ├── UserManagement.tsx       (Req 22)
│   │   │   ├── CompanyApprovalList.tsx  (Req 23)
│   │   │   ├── ContentModerationPanel.tsx (Req 24)
│   │   │   └── AnalyticsDashboard.tsx   (Req 25)
│   │   │
│   │   ├── map/                    ← Map components (Leaflet)
│   │   │   ├── Map.tsx
│   │   │   ├── LocationMarker.tsx
│   │   │   └── RescueCompanyMarker.tsx
│   │   │
│   │   ├── chat/                   ← Chat components (Req 9, 19)
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── MessageInput.tsx
│   │   │
│   │   ├── community/              ← Community (Req 11)
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostDetail.tsx
│   │   │   ├── PostSearch.tsx
│   │   │   └── CommentSection.tsx
│   │   │
│   │   └── notifications/          ← Notifications (Req 7, 14)
│   │       ├── NotificationBell.tsx
│   │       └── NotificationPanel.tsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx        (Req 2)
│   │   │   └── RegisterPage.tsx     (Req 1)
│   │   │
│   │   ├── user/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CreateRequestPage.tsx     (Req 3-5)
│   │   │   ├── RequestDetailPage.tsx     (Req 6-10)
│   │   │   ├── RequestHistoryPage.tsx    (Req 7)
│   │   │   ├── CommunityPage.tsx         (Req 11)
│   │   │   └── ProfilePage.tsx
│   │   │
│   │   ├── rescue-company/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProfilePage.tsx           (Req 12-13)
│   │   │   ├── ServicesPage.tsx          (Req 15)
│   │   │   ├── VehiclesPage.tsx          (Req 16)
│   │   │   ├── RequestsInboxPage.tsx     (Req 17)
│   │   │   ├── RequestDetailPage.tsx     (Req 18)
│   │   │   └── RatingsPage.tsx           (Req 20)
│   │   │
│   │   ├── admin/
│   │   │   ├── DashboardPage.tsx         (Req 25)
│   │   │   ├── UsersPage.tsx             (Req 22)
│   │   │   ├── CompaniesPage.tsx         (Req 23)
│   │   │   ├── ContentModerationPage.tsx (Req 24)
│   │   │   └── ReportsPage.tsx           (Req 25)
│   │   │
│   │   └── HomePage.tsx
│   │
│   ├── services/
│   │   ├── api.ts                    ← Axios instance
│   │   ├── auth.service.ts           ← Req 1-2
│   │   ├── user.service.ts           ← Req 1, 7, 10
│   │   ├── rescue-request.service.ts ← Req 3-8
│   │   ├── rescue-company.service.ts ← Req 6, 12-16, 20
│   │   ├── location.service.ts       ← Req 4, 6
│   │   ├── chat.service.ts           ← Req 9, 19
│   │   ├── rating.service.ts         ← Req 10, 20
│   │   ├── post.service.ts           ← Req 11
│   │   ├── notification.service.ts   ← Req 7, 14
│   │   ├── file.service.ts           ← Req 5
│   │   ├── admin.service.ts          ← Req 22-25
│   │   └── socket.service.ts         ← Real-time setup
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                ← Req 1-2
│   │   ├── useRescueRequest.ts       ← Req 3-8
│   │   ├── useLocation.ts            ← Req 4, 6
│   │   ├── useChat.ts                ← Req 9, 19
│   │   ├── useSocket.ts              ← Real-time
│   │   ├── useNotification.ts        ← Req 7, 14
│   │   ├── useMap.ts                 ← Map operations
│   │   └── usePagination.ts          ← Data pagination
│   │
│   ├── store/
│   │   ├── auth.store.ts             ← Auth state
│   │   ├── user.store.ts             ← User state
│   │   ├── rescue-request.store.ts   ← Request state
│   │   ├── notification.store.ts     ← Notification state
│   │   └── ui.store.ts               ← UI state
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── rescue-request.types.ts
│   │   ├── rescue-company.types.ts
│   │   ├── chat.types.ts
│   │   ├── rating.types.ts
│   │   ├── post.types.ts
│   │   ├── notification.types.ts
│   │   └── location.types.ts
│   │
│   ├── constants/
│   │   ├── request-status.ts        ← PENDING, CONFIRMED, COMPLETED
│   │   ├── service-types.ts         ← Tire repair, fuel, towing...
│   │   ├── api-endpoints.ts
│   │   ├── map-config.ts            ← Leaflet config
│   │   └── socket-events.ts         ← Socket event names
│   │
│   ├── utils/
│   │   ├── string.utils.ts
│   │   ├── date.utils.ts
│   │   ├── validator.utils.ts
│   │   ├── location.utils.ts        ← Distance calc
│   │   ├── map.utils.ts             ← Leaflet utils
│   │   └── error-handler.ts
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   ├── theme.css
│   │   └── maps.css
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── index.html
```

### **Frontend Dependencies**
```bash
npm install react react-dom react-router-dom    # React core
npm install axios                                # API calls
npm install socket.io-client                    # Real-time
npm install leaflet react-leaflet               # Maps
npm install zustand                             # State management
npm install react-hot-toast                     # Notifications
npm install leaflet-geosearch                   # Location search
```

---

## 🔧 Backend Folder

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts              ← MongoDB connection
│   │   ├── env.ts                   ← Environment setup
│   │   ├── socket-io.ts             ← Socket.IO config
│   │   └── constants.ts             ← App constants
│   │
│   ├── models/
│   │   ├── User.model.ts            ← Users (Req 1-2, 22)
│   │   ├── RescueRequest.model.ts   ← Requests (Req 3-8)
│   │   ├── RescueCompany.model.ts   ← Companies (Req 12-13, 23)
│   │   ├── RescueVehicle.model.ts   ← Vehicles (Req 16)
│   │   ├── ChatMessage.model.ts     ← Chat (Req 9, 19)
│   │   ├── Rating.model.ts          ← Ratings (Req 10, 20, 24)
│   │   ├── Notification.model.ts    ← Notifications (Req 7, 14)
│   │   ├── Post.model.ts            ← Posts (Req 11, 24)
│   │   ├── Comment.model.ts         ← Comments (Req 11)
│   │   └── Service.model.ts         ← Services (Req 15)
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts       ← Register, Login (Req 1-2, 21)
│   │   ├── user.controller.ts       ← User management (Req 22)
│   │   ├── rescue-request.controller.ts ← Create, view, cancel (Req 3-8)
│   │   ├── rescue-company.controller.ts ← Company profile (Req 12-13, 23)
│   │   ├── rescue-vehicle.controller.ts ← Vehicle management (Req 16)
│   │   ├── request-action.controller.ts ← Accept/Reject/Complete (Req 17-18)
│   │   ├── chat.controller.ts       ← Chat messages (Req 9, 19)
│   │   ├── rating.controller.ts     ← Ratings & replies (Req 10, 20)
│   │   ├── post.controller.ts       ← Posts & comments (Req 11)
│   │   ├── location.controller.ts   ← Find nearby companies (Req 6)
│   │   ├── file-upload.controller.ts ← Image upload (Req 5)
│   │   ├── notification.controller.ts ← Notifications (Req 7, 14)
│   │   ├── admin.controller.ts      ← Admin operations (Req 22-25)
│   │   └── approval.controller.ts   ← Company approval (Req 23)
│   │
│   ├── services/
│   │   ├── auth.service.ts          ← Auth logic
│   │   ├── user.service.ts          ← User operations
│   │   ├── rescue-request.service.ts ← Request logic
│   │   ├── rescue-company.service.ts ← Company logic
│   │   ├── rescue-vehicle.service.ts ← Vehicle tracking
│   │   ├── location.service.ts      ← Geospatial queries (Req 6)
│   │   ├── chat.service.ts          ← Chat logic
│   │   ├── rating.service.ts        ← Rating logic
│   │   ├── post.service.ts          ← Post logic
│   │   ├── notification.service.ts  ← Notification sending
│   │   ├── file-upload.service.ts   ← File handling
│   │   ├── email.service.ts         ← Email notifications
│   │   ├── admin.service.ts         ← Admin logic (Req 22-25)
│   │   └── report.service.ts        ← Analytics (Req 25)
│   │
│   ├── routes/
│   │   ├── auth.routes.ts           ← POST /register, /login
│   │   ├── user.routes.ts           ← User endpoints
│   │   ├── rescue-request.routes.ts ← Request endpoints
│   │   ├── rescue-company.routes.ts ← Company endpoints
│   │   ├── rescue-vehicle.routes.ts ← Vehicle endpoints
│   │   ├── request-action.routes.ts ← Accept/Reject/Complete
│   │   ├── chat.routes.ts           ← Chat endpoints
│   │   ├── rating.routes.ts         ← Rating endpoints
│   │   ├── post.routes.ts           ← Post endpoints
│   │   ├── location.routes.ts       ← Nearby search
│   │   ├── file-upload.routes.ts    ← Upload image
│   │   ├── notification.routes.ts   ← Notification endpoints
│   │   ├── admin.routes.ts          ← Admin endpoints
│   │   └── approval.routes.ts       ← Approval endpoints
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       ← JWT verification
│   │   ├── role.middleware.ts       ← Role-based access
│   │   ├── error.middleware.ts      ← Error handling
│   │   ├── validation.middleware.ts ← Input validation
│   │   ├── request-logger.middleware.ts
│   │   └── rate-limit.middleware.ts
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── rescue-request.validator.ts
│   │   ├── rescue-company.validator.ts
│   │   ├── chat.validator.ts
│   │   ├── rating.validator.ts
│   │   └── post.validator.ts
│   │
│   ├── utils/
│   │   ├── jwt.utils.ts
│   │   ├── password.utils.ts
│   │   ├── geo.utils.ts             ← Distance calculation
│   │   ├── file.utils.ts
│   │   ├── response.utils.ts
│   │   ├── logger.ts
│   │   ├── date.utils.ts
│   │   └── error-handler.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── rescue-request.types.ts
│   │   ├── rescue-company.types.ts
│   │   ├── chat.types.ts
│   │   ├── rating.types.ts
│   │   ├── post.types.ts
│   │   └── api.types.ts
│   │
│   ├── constants/
│   │   ├── request-status.ts        ← PENDING, CONFIRMED, COMPLETED, CANCELLED
│   │   ├── user-roles.ts            ← USER, COMPANY, ADMIN
│   │   ├── company-status.ts        ← PENDING, VERIFIED, REJECTED
│   │   ├── vehicle-status.ts        ← READY, BUSY, MAINTENANCE
│   │   ├── service-types.ts         ← Tire repair, fuel, towing...
│   │   ├── error-codes.ts
│   │   └── messages.ts
│   │
│   ├── websocket/
│   │   ├── events.ts                ← Event constants
│   │   ├── handlers/
│   │   │   ├── chat.handler.ts      ← Chat messaging
│   │   │   ├── notification.handler.ts ← Push notifications
│   │   │   ├── location.handler.ts  ← Live location
│   │   │   ├── status.handler.ts    ← Request status updates
│   │   │   └── vehicle.handler.ts   ← Vehicle tracking
│   │   ├── middleware/
│   │   │   └── auth.socket.ts       ← Socket auth
│   │   └── socket-server.ts         ← Socket.IO init
│   │
│   ├── jobs/
│   │   ├── notification.job.ts      ← Send notifications
│   │   ├── timeout.job.ts           ← Check request timeout (Req 17)
│   │   └── cleanup.job.ts           ← Cleanup old data
│   │
│   ├── uploads/
│   │   └── .gitkeep                 ← Store uploaded images
│   │
│   └── app.ts
│
├── server.ts                        ← Express + Socket.IO entry
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

### **Backend Key Models (MongoDB Collections)**
```
Models Needed:
1. User              ← Personal users (Req 1-2, 22)
2. RescueCompany     ← Companies (Req 12-13, 23)
3. RescueRequest     ← Rescue requests (Req 3-8, 17-18)
4. RescueVehicle     ← Vehicles (Req 16)
5. ChatMessage       ← Chat (Req 9, 19)
6. Rating            ← Ratings with replies (Req 10, 20)
7. Notification      ← Notifications (Req 7, 14)
8. Post              ← Community posts (Req 11)
9. Comment           ← Post comments (Req 11)
10. Service          ← Service types/pricing (Req 15)
```

### **Backend API Endpoints Structure**
```
Authentication:
POST   /api/auth/register             (Req 1)
POST   /api/auth/login                (Req 2)

Rescue Requests:
POST   /api/rescue-requests           (Req 3-5)
GET    /api/rescue-requests           (Req 7)
GET    /api/rescue-requests/:id       (Req 6-10)
DELETE /api/rescue-requests/:id       (Req 8)

Companies:
POST   /api/rescue-companies          (Req 12)
PATCH  /api/rescue-companies/:id      (Req 13)
GET    /api/rescue-companies/nearby   (Req 6)

Request Actions:
PATCH  /api/requests/:id/accept       (Req 17)
PATCH  /api/requests/:id/reject       (Req 17)
PATCH  /api/requests/:id/complete     (Req 18)
PATCH  /api/requests/:id/eta          (Req 18)

Chat & Ratings:
POST   /api/chat/messages             (Req 9, 19)
GET    /api/chat/:requestId           (Req 9)
POST   /api/ratings                   (Req 10)
PATCH  /api/ratings/:id/reply         (Req 20)

Admin:
GET    /api/admin/users               (Req 22)
PATCH  /api/admin/users/:id/lock      (Req 22)
GET    /api/admin/companies           (Req 23)
PATCH  /api/admin/companies/:id/approve (Req 23)
GET    /api/admin/reports             (Req 25)
```

### **Backend Dependencies**
```bash
npm install express                      # Web framework
npm install mongoose                     # MongoDB ODM
npm install socket.io                    # Real-time
npm install multer                       # File upload
npm install bcryptjs jsonwebtoken        # Auth security
npm install joi                          # Input validation
npm install dotenv cors                  # Config & CORS
npm install bull                         # Job queue (optional)
```

---

## 🎯 Mỗi Folder Làm Gì?

### **Frontend Components - Tổ Chức Theo Features**

| Folder | Chức Năng | Requirements |
|--------|----------|---------------|
| `common/` | UI reusable (Button, Modal, Input...) | All |
| `layout/` | Layout wrapper (Header, Sidebar...) | All |
| `auth/` | Login, Register, Protected route | Req 1-2 |
| `user/` | Create request, track, rate, chat | Req 3-11 |
| `rescue-company/` | Company profile, services, vehicles, requests | Req 12-20 |
| `admin/` | User management, approval, moderation | Req 21-25 |
| `map/` | Leaflet map, markers, location | Req 4, 6 |
| `chat/` | Chat window, messages | Req 9, 19 |
| `community/` | Posts, comments, search | Req 11 |
| `notifications/` | Notification bell, panel | Req 7, 14 |

### **Backend Folders - Tổ Chức Theo Layers**

| Folder | Chức Năng | Requirements |
|--------|----------|---------------|
| `models/` | MongoDB schemas | All features |
| `controllers/` | Handle HTTP requests | All endpoints |
| `services/` | Business logic | All features |
| `routes/` | API endpoints | All endpoints |
| `middleware/` | Auth, validation, error handling | All |
| `validators/` | Input data validation | All endpoints |
| `websocket/` | Real-time chat, notifications, location | Req 7, 9, 14, 19 |
| `utils/` | Helper functions (JWT, password, geo...) | All |
| `constants/` | Status, roles, enums | All |
| `config/` | Database & Socket.IO setup | All |
| `jobs/` | Scheduled tasks | Req 17 (timeout), 25 (reports) |
| `types/` | TypeScript interfaces | All |
| `uploads/` | Store uploaded images | Req 5 |

---

## 📝 Ví Dụ Cụ Thể: Login Feature

### **Cách Organize Folder**

**Frontend:**
```
frontend/src/
├── components/
│   └── auth/
│       └── LoginForm.tsx       ← Form Component
├── pages/
│   └── LoginPage.tsx            ← Page
├── services/
│   └── auth.service.ts          ← API call
├── types/
│   └── auth.types.ts            ← Type definition
└── hooks/
    └── useAuth.ts               ← Custom hook
```

**Backend:**
```
backend/src/
├── models/
│   └── User.model.ts            ← User schema
├── controllers/
│   └── auth.controller.ts       ← Handle login request
├── services/
│   └── auth.service.ts          ← Business logic
├── routes/
│   └── auth.routes.ts           ← POST /api/auth/login
└── middleware/
    └── auth.middleware.ts       ← Check token
```

### **Code Flow - Ví Dụ Feature "Create Request"**

```
1. Frontend: <CreateRequestForm /> (component trong user/)
   - User điền: description, service type, location, image
   ↓ (call service)
2. Frontend: rescueRequestService.create(formData)
   - Upload image via file.service.ts
   - Get location từ location.service.ts
   ↓ (HTTP POST)
3. Backend: POST /api/rescue-requests (route)
   - Validate input (validators, middleware)
   ↓ (tới controller)
4. Backend: requestController.createRequest()
   - Call requestService.createRequest()
   ↓ (business logic)
5. Backend: requestService.createRequest()
   - Save file upload
   - Save RescueRequest model
   - Find nearby companies (location.service)
   - Send notifications via Socket.IO
   ↓
6. Backend: RescueRequest.create() (model - MongoDB)
   - Return saved request with ID
   ↓
7. Frontend: Store request ID in state (zustand)
   - Redirect to tracking page
   ↓ (real-time)
8. Socket.IO: Broadcast notification to nearby companies
   - Emit 'rescueRequest:new' event
   - Companies receive via handleRequestNotification()
```

### **Real-Time Features (Socket.IO)**

```
Frontend connections:
├── Socket.IO Client (useSocket.ts hook)
└── Listens to events: 'chat:message', 'request:statusChanged', 'vehicle:positionUpdate'

Backend handlers via websocket/:
├── chat.handler.ts         → Handle incoming messages
├── notification.handler.ts → Send push notifications
├── location.handler.ts     → Broadcast location updates
├── status.handler.ts       → Update request status in real-time
└── vehicle.handler.ts      → Track vehicle position

Events flow:
1. User creates request → Server broadcasts to nearby companies (location.handler)
2. Company accepts → Server notifies user (status.handler + Socket.IO emit)
3. Company updates ETA → Real-time update to user (vehicle.handler)
4. User sends message → Chat handler broadcasts (chat.handler)
```

---