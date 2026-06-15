# Tài liệu Kiểm thử Đơn vị (Unit Testing)

> **Module:** Rescue Request — Backend  
> **Project:** CuuHo247  
> **Phiên bản:** 1.0  
> **Tổng số test cases:** 67 (tất cả PASS ✅)

---

## Mục lục

1. [Cấu trúc thư mục test](#1-cấu-trúc-thư-mục-test)
2. [Cách cài đặt và chạy test](#2-cách-cài-đặt-và-chạy-test)
3. [Các kỹ thuật kiểm thử đã sử dụng](#3-các-kỹ-thuật-kiểm-thử-đã-sử-dụng)
4. [Phạm vi kiểm thử](#4-phạm-vi-kiểm-thử)
5. [Chiến lược Mock](#5-chiến-lược-mock)
6. [Tóm tắt test cases](#6-tóm-tắt-test-cases)
7. [Kết quả chạy test](#7-kết-quả-chạy-test)
8. [Giới hạn của Unit Test](#8-giới-hạn-của-unit-test)

---

## 1. Cấu trúc thư mục test

```
backend/
├── src/                                      ← Mã nguồn ứng dụng
│   └── modules/rescue/
│       ├── customer.service.ts               ← Service cần test
│       └── company.service.ts                ← Service cần test
│
├── tests/                                    ← Thư mục chứa toàn bộ test (tách biệt src/)
│   ├── tsconfig.json                         ← Config TypeScript cho IDE trong thư mục test
│   ├── test-cases.csv                        ← Bảng test cases xuất Excel
│   ├── TESTING.md                            ← Tài liệu này
│   └── unit/
│       └── modules/
│           └── rescue/
│               ├── customer.service.test.ts  ← 21 test cases cho RescueCustomerService
│               └── company.service.test.ts   ← 46 test cases cho CompanyRescueRequestService
│
├── jest.config.ts                            ← Cấu hình Jest
├── tsconfig.json                             ← Cấu hình TypeScript (bao gồm tests/)
├── tsconfig.build.json                       ← Cấu hình build production (không bao gồm tests/)
└── tsconfig.test.json                        ← Cấu hình TypeScript cho ts-jest
```

---

## 2. Cách cài đặt và chạy test

### Yêu cầu
- Node.js >= 18
- npm >= 9

### Cài đặt dependencies

```bash
cd backend
npm install
```

### Chạy test

```bash
# Chạy toàn bộ test cases (1 lần)
npm run test

# Chạy và tự động re-run khi thay đổi file
npm run test:watch

# Chạy và đo lường code coverage
npm run test:coverage
```

### Build production (không bao gồm test)

```bash
npm run build
```

---

## 3. Các kỹ thuật kiểm thử đã sử dụng

### 3.1. Phân lớp tương đương (Equivalence Partitioning)

Chia dữ liệu đầu vào thành các lớp tương đương — lớp hợp lệ và lớp không hợp lệ. Chỉ cần đại diện 1 giá trị từ mỗi lớp để kiểm thử.

**Ví dụ áp dụng:**
- `getRequestsForUser`: Lớp hợp lệ (userId tồn tại có dữ liệu) vs Lớp hợp lệ rỗng (không có request)
- `createRescueRequest`: Lớp có `address` vs Lớp không có `address`; Lớp có `service_types` vs không có
- `cancelRequest`: Lớp status được phép hủy (`pending`, `accepted`) vs Lớp không được phép hủy (`in_progress`, `completed`, `cancelled`)
- `acceptPendingRequestForCompany`: Lớp xe hợp lệ vs Lớp xe bận vs Lớp xe không tồn tại

### 3.2. Phân tích giá trị biên (Boundary Value Analysis)

Kiểm thử tại các giá trị biên — nơi lỗi thường xuất hiện nhiều nhất.

**Ví dụ áp dụng:**
- Mảng rỗng vs mảng có 1+ phần tử (`getRequestsForUser`, `getPendingRequestsForCompany`, ...)
- `incident_photos = undefined` → trả về `[]` thay vì crash (TC-CO-2.3)
- `distance_km = null` → `eta_minutes` phải là `null`, không được gọi `estimateEtaMinutes` (TC-CO-13.5)
- Không có dịch vụ nào → `min_price = null`, `max_price = null` thay vì NaN (TC-CO-14.5)
- `max_distance_km` không truyền → sử dụng giá trị mặc định 50 (TC-CO-14.6)

### 3.3. Đoán lỗi (Error Guessing)

Dựa trên kinh nghiệm về các lỗi phổ biến trong hệ thống phân tán và nghiệp vụ đặc thù để thiết kế test cases.

**Ví dụ áp dụng:**
- **Race condition**: `acceptPendingRequestForCompany` — Đơn đã bị công ty khác nhận trước khi DB cập nhật, `acceptPendingRequest` trả `null` → xe **không được** đổi trạng thái (TC-CO-5.6)
- **Sai chủ sở hữu**: User A hủy đơn của User B → `ForbiddenError` (TC-CS-3.2)
- **DB update thất bại**: `cancelById` trả `null` → `InternalServerError` (TC-CS-3.6)
- **Dữ liệu thiếu**: Request hoàn thành không có `vehicle_id` → không được gọi `vehicleRepository.update` (TC-CO-10.4)

### 3.4. Kiểm thử nhánh (Branch Coverage)

Đảm bảo mọi nhánh điều kiện (`if/else`) đều được thực thi ít nhất một lần.

**Ví dụ áp dụng:**
- `createRescueRequest`: Kiểm thử riêng từng field tùy chọn (address, service_types, photos) — cả trường hợp có và không có
- `estimateRequestRouteForCompany`: Dùng tọa độ công ty (không truyền origin) vs dùng tọa độ custom
- `searchNearbyCompanies`: Có/không có `incident_type`; fallback khi `findNearby` rỗng; lọc theo matching service
- Tọa độ GeoJSON: Đảm bảo thứ tự `[lng, lat]` đúng chuẩn GeoJSON (TC-CS-2.2)

---

## 4. Phạm vi kiểm thử

| Service | Phương thức | Số TCs |
|---|---|---|
| `RescueCustomerService` | `getRequestsForUser` | 2 |
| `RescueCustomerService` | `createRescueRequest` | 11 |
| `RescueCustomerService` | `cancelRequest` | 8 |
| `CompanyRescueRequestService` | `getPendingRequestsForCompany` | 3 |
| `CompanyRescueRequestService` | `getPendingRequestDetailForCompany` | 3 |
| `CompanyRescueRequestService` | `getActiveRequestsForCompany` | 2 |
| `CompanyRescueRequestService` | `getActiveRequestDetailForCompany` | 2 |
| `CompanyRescueRequestService` | `acceptPendingRequestForCompany` | 7 |
| `CompanyRescueRequestService` | `startActiveRequestForCompany` | 3 |
| `CompanyRescueRequestService` | `arriveActiveRequestForCompany` | 3 |
| `CompanyRescueRequestService` | `getCompletedRequestsForCompany` | 2 |
| `CompanyRescueRequestService` | `getCompletedRequestDetailForCompany` | 2 |
| `CompanyRescueRequestService` | `completeActiveRequestForCompany` | 4 |
| `CompanyRescueRequestService` | `getCanceledRequestsForCompany` | 2 |
| `CompanyRescueRequestService` | `getCanceledRequestDetailForCompany` | 2 |
| `CompanyRescueRequestService` | `estimateRequestRouteForCompany` | 5 |
| `CompanyRescueRequestService` | `searchNearbyCompanies` | 6 |
| **Tổng** | **17 phương thức** | **67** |

---

## 5. Chiến lược Mock

Đây là **Unit Test** (kiểm thử đơn vị), không kết nối database hay các service bên ngoài thực tế. Tất cả các dependency đều được thay thế bằng **mock functions** của Jest:

| Dependency được mock | Lý do |
|---|---|
| `rescueRepository` | Không kết nối MongoDB |
| `companyRepository` | Không kết nối MongoDB |
| `vehicleRepository` | Không kết nối MongoDB |
| `serviceCategoryRepository` | Không kết nối MongoDB |
| `serviceRepository` | Không kết nối MongoDB |
| `geo.util` (getDistanceFromCoordinates, calcDistanceKm, estimateEtaMinutes) | Kiểm soát giá trị khoảng cách trả về |
| `incidentMapping` (mapIncidentTypeToCategory) | Kiểm soát mapping |

**`jest.clearAllMocks()`** được gọi trong `beforeEach` để đảm bảo mỗi test case bắt đầu với trạng thái sạch.

---

## 6. Tóm tắt test cases

Xem file **[test-cases.csv](./test-cases.csv)** để xem toàn bộ 67 test cases với:
- Mã TC, Module, Service, Phương thức
- Kỹ thuật kiểm thử áp dụng
- Dữ liệu đầu vào (Input)
- Kết quả mong đợi (Expected Output)
- Trạng thái (PASS/FAIL)

---

## 7. Kết quả chạy test

```
Test Suites: 2 passed, 2 total
Tests:       67 passed, 67 total
Snapshots:   0 total
Time:        3.842 s
```

---

## 8. Giới hạn của Unit Test

Unit test này chỉ kiểm thử logic nghiệp vụ trong lớp Service, **không** bao gồm:

| Phạm vi | Loại test cần thêm |
|---|---|
| Kết nối thật với MongoDB | Integration Test |
| HTTP API (routes, middleware, JWT) | API Test (supertest) |
| Socket.IO events | Integration Test |
| Luồng người dùng end-to-end | E2E Test (playwright/cypress) |
