## Đăng ký với tư cách Công ty

Tài liệu này mô tả luồng **đăng ký tài khoản Công ty cứu hộ** (rescue company) ở cả Frontend và Backend.

### Tổng quan luồng

- **Frontend**: Người dùng vào `Đăng ký` → chọn `Công ty cứu hộ` → điền form → submit.
- **Backend**: Nhận request `POST /api/auth/company-register` → validate → hash mật khẩu → tạo document trong collection `companies`.
- **Trạng thái sau đăng ký**: Tài khoản công ty được tạo ở trạng thái **chờ duyệt**:
  - `status`: `pending_verification`
  - `is_verified`: `false`

### API

#### Endpoint

- **Method**: `POST`
- **URL**: `/api/auth/company-register`
- **Content-Type**: `application/json`

#### Request body

```json
{
  "company_name": "Cứu hộ 247",
  "director_name": "Nguyễn Văn A",
  "phone": "0912345678",
  "email": "company@example.com",
  "password": "Password123!",
  "address": "123 Nguyễn Trãi, Q.1, TP.HCM",
  "service_area": "tp_hcm",
  "license_file_url": "https://example.com/license.png",
  "terms_accepted": true
}
```

#### Field rules (backend validate)

- **company_name**: bắt buộc, 2–100 ký tự
- **director_name**: bắt buộc, 2–50 ký tự
- **phone**: bắt buộc, 10–11 chữ số
- **email**: bắt buộc, đúng định dạng email
- **password**: bắt buộc, tối thiểu 8 ký tự
- **address**: bắt buộc, 5–200 ký tự
- **service_area**: bắt buộc, 1 trong các giá trị:
  - `tp_hcm`, `can_tho`, `hai_phong`, `da_nang`, `ha_noi`
- **license_file_url**: _không bắt buộc_, nếu có phải là URL hợp lệ, tối đa 500 ký tự  
  (dùng để lưu link ảnh/PDF giấy phép kinh doanh)
- **terms_accepted**: bắt buộc, phải là `true`

### Response

#### Success (201)

```json
{
  "status": "success",
  "message": "Đăng ký công ty thành công. Chờ xác minh từ quản trị viên",
  "data": {
    "_id": "…",
    "email": "company@example.com",
    "company_name": "Cứu hộ 247",
    "director_name": "Nguyễn Văn A",
    "phone": "0912345678",
    "address": "123 Nguyễn Trãi, Q.1, TP.HCM",
    "service_area": "tp_hcm",
    "license_file_url": "https://example.com/license.png",
    "status": "pending_verification",
    "is_verified": false,
    "created_at": "…",
    "updated_at": "…"
  }
}
```

#### Validation error (400)

```json
{
  "status": "error",
  "message": "Dữ liệu không hợp lệ",
  "errors": ["\"service_area\" is required"]
}
```

#### Duplicate email (400)

```json
{
  "status": "error",
  "message": "Email đã được sử dụng"
}
```

### Frontend mapping

- **Page**: `frontend/src/pages/auth/CompanyRegisterPage.tsx`
- **Form**: `frontend/src/components/auth/CompanyRegisterForm.tsx`
- **API service**: `frontend/src/services/auth.service.ts` → `authService.registerCompany(...)`

### Mô tả các hàm/luồng (FE/BE)

#### Backend (BE)

- **Route**: `backend/src/routes/auth.route.ts`
  - `POST /company-register` → `authController.registerCompany`

- **Controller**: `backend/src/controllers/auth.controller.ts`
  - **`registerCompany(req, res, next)`**:
    - Validate `req.body` bằng `registerCompanySchema`
    - Nếu lỗi → trả `400` với `message` + `errors[]`
    - Nếu hợp lệ → gọi `authService.registerCompany(value)` và trả `201`

- **Validator**: `backend/src/validators/auth.validator.ts`
  - **`registerCompanySchema`**:
    - Kiểm tra các field bắt buộc: `company_name`, `director_name`, `phone`, `email`, `password`, `address`, `service_area`, `terms_accepted`
    - Field optional: `license_file_url` (URL)

- **Service**: `backend/src/services/auth.service.ts`
  - **`registerCompany(companyData)`**:
    - Check trùng email ở cả `users` và `companies`
    - Hash `password` → `password_hash`
    - Tạo company mới với trạng thái:
      - `status: 'pending_verification'`
      - `is_verified: false`
    - Trả về dữ liệu đã **loại `password_hash`**

- **Repository/Model**:
  - `backend/src/repositories/company.repository.ts`:
    - `create(...)`: lưu document vào MongoDB
    - `findByEmail(...)`: phục vụ check trùng
  - `backend/src/models/Company.model.ts`:
    - Schema field `license_file_url` để lưu link giấy phép

#### Frontend (FE)

- **Page**: `frontend/src/pages/auth/CompanyRegisterPage.tsx`
  - Render layout + `<CompanyRegisterForm />`

- **Form**: `frontend/src/components/auth/CompanyRegisterForm.tsx`
  - **State**: `formData` chứa các input (gồm `license_file_url`), `errors`, `isLoading`
  - **`handleChange(e)`**:
    - Dựa vào `e.target.name` để set đúng field trong `formData`
    - Hỗ trợ checkbox `terms_accepted`
  - **`validateForm()`**:
    - Validate nhanh phía client (required, format cơ bản)
    - Set `errors[field]` để hiển thị dưới input
  - **`handleSubmit(e)`**:
    - Nếu validate OK → gọi `authService.registerCompany(payload)`
    - Thành công → `toast.success(...)` + reset form + chuyển về `/login`
    - Thất bại → `toast.error(...)` (ưu tiên `errors[]` từ backend)

- **API service**: `frontend/src/services/auth.service.ts`
  - **`authService.registerCompany(data)`**:
    - `axios.post(`${VITE_API_URL}/auth/company-register`, data)`
    - Gửi JSON (không dùng upload file)

- **UI Input fix quan trọng**: `frontend/src/components/common/Input.tsx`
  - `name` được truyền xuống `TextField` để `handleChange` hoạt động đúng (tránh lỗi “không gõ được chữ”).

### Ghi chú vận hành

- Sau khi đăng ký, công ty **chưa đăng nhập được** cho tới khi admin duyệt (vì `pending_verification` / `is_verified=false`).
- Khi cần hiển thị danh sách khu vực hoạt động ở UI, lấy từ `frontend/src/constants/serviceAreas.ts`.
