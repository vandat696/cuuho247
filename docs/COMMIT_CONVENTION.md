# Quy chuẩn Commit Message (Conventional Commits)

Dự án này sử dụng công cụ `commitlint` để kiểm tra thông điệp commit. Mọi commit phải tuân thủ định dạng dưới đây để đảm bảo lịch sử dự án rõ ràng và dễ quản lý.

## 1. Cấu trúc của 1 Commit Message

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

- **Type (Bắt buộc):** Mục đích của lần thay đổi này.
- **Scope (Tùy chọn):** Phạm vi thay đổi (Vd: `ui`, `api`, `auth`, `backend`, `frontend`).
- **Subject (Bắt buộc):** Mô tả ngắn gọn về thay đổi (Viết thường, động từ nguyên mẫu, không có dấu chấm ở cuối).

---

## 2. Các loại Type phổ biến

| Type         | Ý nghĩa       | Khi nào dùng?                                                                      |
| :----------- | :------------ | :--------------------------------------------------------------------------------- |
| **feat**     | Feature       | Khi thêm tính năng mới cho dự án.                                                  |
| **fix**      | Bug Fix       | Khi sửa lỗi (bug).                                                                 |
| **docs**     | Documentation | Khi thay đổi tài liệu (README, hướng dẫn, comment).                                |
| **style**    | Styling       | Thay đổi về format code (khoảng trắng, dấu chấm phẩy) - KHÔNG thay đổi logic code. |
| **refactor** | Refactoring   | Tái cấu trúc code nhưng không sửa lỗi cũng không thêm tính năng mới.               |
| **perf**     | Performance   | Cải thiện hiệu suất của ứng dụng.                                                  |
| **test**     | Testing       | Thêm hoặc sửa các bộ test case.                                                    |
| **build**    | Build System  | Thay đổi cấu trúc build (webpack, npm, dependencies).                              |
| **ci**       | CI Config     | Thay đổi file cấu hình CI (GitHub Actions, Jenkins).                               |
| **chore**    | Chore         | Các thay đổi lặt vặt khác (setup dự án ban đầu, cập nhật cấu hình linh tinh).      |
| **revert**   | Revert        | Khi muốn hủy bỏ (revert) một commit trước đó.                                      |

---

## 3. Ví dụ minh họa

### ✅ Hợp lệ (Nên dùng)

- `feat(auth): thêm tính năng đăng nhập bằng Google`
- `fix(api): sửa lỗi không nhận được tọa độ GPS`
- `docs: cập nhật hướng dẫn cài đặt môi trường`
- `chore: thiết lập cấu hình eslint v9`
- `style: format lại code trong thư mục services`

### ❌ Không hợp lệ (Sẽ bị báo lỗi)

- `test commit` (Thiếu type)
- `fix lỗi hiển thị` (Thiếu dấu hai chấm sau type)
- `Fixed some bugs` (Subject nên bắt đầu bằng động từ thì hiện tại và không viết hoa chữ đầu nếu muốn clean)

---

## 4. Tại sao chúng ta cần làm điều này?

1. **Lịch sử rõ ràng:** Nhìn vào `git log` có thể biết ngay thay đổi nào là tính năng, thay đổi nào là sửa lỗi.
2. **Tự động hóa:** Có thể tự động tạo `CHANGELOG.md` hoặc tự động tăng version dự án dựa trên type của commit.
3. **Chuyên nghiệp:** Giúp các thành viên mới trong team dễ dàng nắm bắt tiến độ công việc.

---

_Lưu ý: Nếu bạn commit sai định dạng, hệ thống sẽ ngăn chặn việc commit thành công cho đến khi bạn sửa lại đúng._
