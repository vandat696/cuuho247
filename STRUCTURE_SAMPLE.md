# 🎯 Cấu Trúc Thư Mục

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
│   │   ├── common/
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── rescue-company/
│   │   ├── admin/
│   │   ├── map/                    ← Map components (Leaflet)
│   │   ├── chat/
│   │   ├── community/
│   │   └── notifications/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── rescue-company/
│   │   ├── admin/
│   │   └── HomePage.tsx
│   │
│   ├── services/
│   ├── hooks/
│   ├── store/
│   ├── types/
│   ├── constants/
│   │
│   ├── utils/
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
│   ├── models/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   ├── constants/
│   ├── websocket/
│   │   ├── events.ts                ← Event constants
│   │   ├── handlers/
│   │   ├── middleware/
│   │   │   └── auth.socket.ts       ← Socket auth
│   │   └── socket-server.ts         ← Socket.IO init
│   ├── jobs/
│   ├── uploads/
│   │   └── .gitkeep                 ← Store uploaded images
│   └── app.ts
├── server.ts                        ← Express + Socket.IO entry
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

### **Backend Key Models (MongoDB Collections)**

```
Models Needed:
1. Customer
2. RescueCompany
3. RescueRequest
4. RescueVehicle
5. ChatMessage
6. Rating
7. Notification
8. Post
9. Comment
10. Service
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

| Folder            | Chức Năng                                     | Requirements |
| ----------------- | --------------------------------------------- | ------------ |
| `common/`         | UI reusable (Button, Modal, Input...)         | All          |
| `layout/`         | Layout wrapper (Header, Sidebar...)           | All          |
| `auth/`           | Login, Register, Protected route              | Req 1-2      |
| `user/`           | Create request, track, rate, chat             | Req 3-11     |
| `rescue-company/` | Company profile, services, vehicles, requests | Req 12-20    |
| `admin/`          | User management, approval, moderation         | Req 21-25    |
| `map/`            | Leaflet map, markers, location                | Req 4, 6     |
| `chat/`           | Chat window, messages                         | Req 9, 19    |
| `community/`      | Posts, comments, search                       | Req 11       |
| `notifications/`  | Notification bell, panel                      | Req 7, 14    |

### **Backend Folders - Tổ Chức Theo Layers**

| Folder          | Chức Năng                                                           | Requirements                   |
| --------------- | ------------------------------------------------------------------- | ------------------------------ |
| `models/`       | MongoDB schemas                                                     | All features                   |
| `controllers/`  | Điều phối request/response (req, res). Không xử lý logic phức tạp.  | All endpoints                  |
| `services/`     | Logic nghiệp vụ (Business Logic), tính toán, gọi service bên thứ 3. | All features                   |
| `repositories/` | Tương tác trực tiếp với Model/Database (CRUD). Tách biệt query DB.  | All features                   |
| `routes/`       | API endpoints                                                       | All endpoints                  |
| `middleware/`   | Auth, validation, error handling                                    | All                            |
| `validators/`   | Input data validation                                               | All endpoints                  |
| `websocket/`    | Real-time chat, notifications, location                             | Req 7, 9, 14, 19               |
| `utils/`        | Helper functions (JWT, password, geo...)                            | All                            |
| `constants/`    | Status, roles, enums                                                | All                            |
| `config/`       | Database & Socket.IO setup                                          | All                            |
| `jobs/`         | Scheduled tasks                                                     | Req 17 (timeout), 25 (reports) |
| `types/`        | TypeScript interfaces                                               | All                            |
| `uploads/`      | Store uploaded images                                               | Req 5                          |

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
│   └── auth.service.ts          ← Business logic (tính toán, verify)
├── repositories/
│   └── user.repository.ts       ← Query DB (findUserByEmail)
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
   ↓
5. Backend: requestService.createRequest() (Business Logic)
   - Xử lý ảnh (file upload)
   - Logic tìm kiếm công ty gần nhất
   - Gọi repository để lưu dữ liệu
   - Gọi Socket.IO để thông báo
   ↓
6. Backend: requestRepository.save() (Data Access)
   - Tương tác trực tiếp với Mongoose Model
   - Thực thi lưu vào MongoDB
   ↓
7. Backend: RescueRequest.create() (Model - MongoDB)
   - Lưu trữ thực tế
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

## 📡 Data Flow Architecture (Luồng dữ liệu)

Để đảm bảo hệ thống dễ mở rộng và bảo trì, dữ liệu sẽ đi qua các lớp (layers) theo trình tự sau:

### **1. HTTP Request Flow (REST API)**

1.  **Client (Frontend)**: Gửi request (GET, POST, PATCH...).
2.  **Routes**: Nhận request và chuyển hướng tới đúng Controller.
3.  **Middleware / Validators**:
    - Kiểm tra Token (Auth).
    - Kiểm tra dữ liệu đầu vào (Joi).
    - Nếu lỗi -> Trả về lỗi ngay lập tức.
4.  **Controllers**:
    - Bóc tách dữ liệu từ `req.body`, `req.params`.
    - Gọi đúng hàm xử lý ở lớp **Service**.
    - Trả về response (JSON) cho Client.
5.  **Services**:
    - Xử lý **Business Logic** chính.
    - Gọi lớp **Repository** để đọc/ghi dữ liệu.
6.  **Repositories**:
    - Nơi duy nhất chứa các câu lệnh `Mongoose` (DB Queries).
    - Trả về dữ liệu cho Service.
7.  **Models (Database)**: Định nghĩa cấu trúc Schema trong MongoDB.

---

## 🏆 Quy Tắc Vàng (Golden Rules)

- **Controller**: Không chứa Logic nghiệp vụ.
- **Service**: Không chứa trực tiếp cú pháp Mongoose (hãy dùng Repository).
- **Repository**: Chỉ làm nhiệm vụ truy vấn và lưu dữ liệu.
