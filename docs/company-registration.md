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
- **license_file_url**: *không bắt buộc*, nếu có phải là URL hợp lệ, tối đa 500 ký tự  
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
  "errors": [
    "\"service_area\" is required"
  ]
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

### Ghi chú vận hành

- Sau khi đăng ký, công ty **chưa đăng nhập được** cho tới khi admin duyệt (vì `pending_verification` / `is_verified=false`).
- Khi cần hiển thị danh sách khu vực hoạt động ở UI, lấy từ `frontend/src/constants/serviceAreas.ts`.

