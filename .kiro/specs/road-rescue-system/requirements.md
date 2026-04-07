# Tài Liệu Yêu Cầu Hệ Thống

## Giới Thiệu

Hệ thống Hỗ Trợ Sự Cố Xe Trên Đường (Road Rescue System) là một nền tảng số kết nối người tham gia giao thông gặp sự cố với các đơn vị cứu hộ chuyên nghiệp. Hệ thống được xây dựng trên nền tảng React + Vite (frontend), Node.js (backend) và MongoDB Atlas (database), hỗ trợ ba nhóm người dùng chính: người dùng cá nhân, công ty cứu hộ và quản trị viên hệ thống.

---

## Bảng Thuật Ngữ

- **System**: Hệ thống Hỗ Trợ Sự Cố Xe Trên Đường
- **User**: Người dùng cá nhân đã đăng ký tài khoản, gặp sự cố xe và cần hỗ trợ
- **RescueCompany**: Công ty/đơn vị cung cấp dịch vụ cứu hộ giao thông đã được xác minh
- **Admin**: Quản trị viên hệ thống có quyền quản lý toàn bộ nền tảng
- **RescueRequest**: Yêu cầu cứu hộ do User tạo ra, chứa thông tin sự cố và vị trí
- **RescueVehicle**: Phương tiện cứu hộ thuộc sở hữu của RescueCompany
- **GPS_Location**: Tọa độ địa lý (vĩ độ, kinh độ) xác định vị trí sự cố
- **ChatMessage**: Tin nhắn trao đổi giữa User và RescueCompany trong một RescueRequest
- **Rating**: Đánh giá chất lượng dịch vụ do User gửi sau khi RescueRequest hoàn tất
- **Notification**: Thông báo gửi đến User hoặc RescueCompany
- **AuthService**: Dịch vụ xác thực và phân quyền người dùng
- **ETA**: Thời gian dự kiến đến hiện trường (Estimated Time of Arrival)

---

## Phần 1: Yêu Cầu Dành Cho Người Dùng Cá Nhân

### Yêu Cầu 1: Đăng Ký Tài Khoản Cá Nhân

**User Story:** Là người dùng cá nhân, tôi muốn đăng ký tài khoản bằng email và mật khẩu để bắt đầu sử dụng dịch vụ cứu hộ.

#### Tiêu Chí Chấp Nhận

1. GIVEN người dùng chưa có tài khoản WHEN nhập email hợp lệ và mật khẩu hợp lệ THEN hệ thống tạo tài khoản thành công.
2. IF người dùng nhập email đã tồn tại WHEN gửi yêu cầu đăng ký THEN hệ thống hiển thị lỗi "Email đã được sử dụng".
3. IF người dùng nhập email/mật khẩu không hợp lệ hoặc thiếu WHEN gửi form THEN hệ thống hiển thị lỗi và yêu cầu nhập lại.
4. WHEN đăng ký thành công THEN hệ thống chuyển hướng đến trang đăng nhập hoặc trang chính.

---

### Yêu Cầu 2: Đăng Nhập Hệ Thống

**User Story:** Là người dùng cá nhân, tôi muốn đăng nhập vào hệ thống an toàn để truy cập lịch sử và gọi cứu hộ.

#### Tiêu Chí Chấp Nhận

1. GIVEN người dùng đã có tài khoản WHEN nhập đúng email và mật khẩu THEN hệ thống cho phép đăng nhập thành công.
2. IF người dùng nhập sai email hoặc mật khẩu THEN hệ thống hiển thị lỗi "Email hoặc mật khẩu không đúng".
3. WHEN đăng nhập thành công THEN hệ thống chuyển hướng đến trang chính và tạo session/token để duy trì trạng thái đăng nhập.

---

### Yêu Cầu 3: Nhập Thông Tin Sự Cố

**User Story:** Là người dùng gặp sự cố, tôi muốn điền form mô tả tình trạng xe và chọn loại dịch vụ để thợ có thể chuẩn bị.

#### Tiêu Chí Chấp Nhận

1. GIVEN người dùng đã đăng nhập WHEN truy cập chức năng tạo yêu cầu cứu hộ THEN hệ thống cho phép nhập mô tả và chọn loại dịch vụ.
2. WHEN người dùng nhập mô tả tình trạng xe và chọn loại dịch vụ THEN hệ thống ghi nhận thông tin.
3. GIVEN người dùng đã nhập đầy đủ thông tin bắt buộc WHEN gửi yêu cầu THEN hệ thống tạo yêu cầu cứu hộ thành công.
4. IF người dùng nhập thiếu thông tin bắt buộc WHEN gửi yêu cầu THEN hệ thống hiển thị thông báo lỗi.

---

### Yêu Cầu 4: Xác Định Vị Trí Sự Cố

**User Story:** Là người dùng gặp sự cố, tôi muốn hệ thống tự động bắt tọa độ GPS hoặc cho phép nhập địa chỉ thủ công để xác định vị trí.

#### Tiêu Chí Chấp Nhận

1. GIVEN người dùng đã cấp quyền truy cập vị trí WHEN mở form tạo yêu cầu THEN hệ thống tự động lấy GPS_Location và hiển thị cho người dùng kiểm tra.
2. IF người dùng từ chối quyền truy cập vị trí THEN hệ thống cho phép nhập địa chỉ thủ công theo cấu trúc cascade: Tỉnh/Thành phố → Quận/Huyện → Xã/Phường → Số nhà/Tên đường.
3. WHEN người dùng chọn Tỉnh/Thành phố THEN hệ thống tự động cập nhật danh sách Quận/Huyện tương ứng, và tương tự cho các cấp tiếp theo.
4. IF người dùng gửi yêu cầu mà không cung cấp vị trí THEN hệ thống hiển thị thông báo lỗi yêu cầu cung cấp vị trí.

---

### Yêu Cầu 5: Đính Kèm Ảnh Hiện Trường

**User Story:** Là người dùng gặp sự cố, tôi muốn tải lên một bức ảnh chụp hiện trường để thợ dễ hình dung mức độ hư hỏng.

#### Tiêu Chí Chấp Nhận

1. GIVEN người dùng đang tạo yêu cầu WHEN tải lên ảnh hợp lệ THEN hệ thống hiển thị preview ảnh đã tải lên.
2. THE System SHALL cho phép User đính kèm 1 hình ảnh mô tả tình trạng xe.
3. IF tệp tải lên không phải định dạng hình ảnh hợp lệ THEN hệ thống hiển thị thông báo lỗi.
4. WHEN ảnh đã được tải lên THEN người dùng có thể thay đổi hoặc xóa ảnh trước khi gửi yêu cầu.

---

### Yêu Cầu 6: Xem Danh Sách Và Chọn Đơn Vị Cứu Hộ

**User Story:** Là người dùng, tôi muốn xem danh sách các công ty cứu hộ gần mình kèm giá dịch vụ và đánh giá để chọn dịch vụ phù hợp.

#### Tiêu Chí Chấp Nhận

1. GIVEN đã biết vị trí người dùng WHEN người dùng yêu cầu xem danh sách THEN hệ thống hiển thị danh sách các công ty cứu hộ trong khu vực, sắp xếp theo khoảng cách tăng dần.
2. THE System SHALL hiển thị cho mỗi RescueCompany: tên công ty, khoảng cách, mức giá dịch vụ và điểm đánh giá trung bình.
3. IF không có công ty nào trong khu vực THEN hệ thống hiển thị thông báo và gợi ý mở rộng phạm vi tìm kiếm.
4. WHEN người dùng chọn một công ty và xác nhận gửi yêu cầu THEN hệ thống tạo RescueRequest và gửi Notification đến RescueCompany.
5. THE System SHALL chỉ hiển thị các RescueCompany có trạng thái "Đã xác minh" và đang hoạt động.

---

### Yêu Cầu 7: Theo Dõi Trạng Thái Yêu Cầu

**User Story:** Là người dùng, tôi muốn nhận thông báo mỗi khi có phản hồi từ đơn vị cứu hộ và thay đổi trạng thái để an tâm chờ đợi.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cập nhật trạng thái RescueRequest theo các bước: "Chờ xác nhận" → "Đã xác nhận" → "Đang xử lý" → "Hoàn tất".
2. WHEN trạng thái RescueRequest thay đổi THEN hệ thống gửi Notification đến User.
3. WHILE RescueRequest ở trạng thái "Đang xử lý" THEN hệ thống hiển thị ETA do công ty cứu hộ cung cấp.
4. THE System SHALL lưu lịch sử toàn bộ các thay đổi trạng thái kèm thời gian.

---

### Yêu Cầu 8: Hủy Yêu Cầu Cứu Hộ

**User Story:** Là người dùng, tôi muốn hủy yêu cầu cứu hộ khi không còn cần thiết.

#### Tiêu Chí Chấp Nhận

1. WHEN RescueRequest ở trạng thái "Chờ xác nhận" THEN hệ thống cho phép User hủy ngay lập tức mà không cần lý do.
2. WHEN RescueRequest ở trạng thái "Đã xác nhận" hoặc "Đang xử lý" THEN hệ thống yêu cầu User chọn lý do hủy trước khi xác nhận.
3. IF người dùng chưa chọn lý do hủy WHEN xác nhận hủy THEN hệ thống không cho phép và hiển thị thông báo yêu cầu chọn lý do.
4. WHEN User hủy RescueRequest THEN hệ thống gửi Notification kèm lý do đến RescueCompany.
5. IF RescueRequest đã ở trạng thái "Hoàn tất" THEN hệ thống ngăn User thực hiện hủy.

---

### Yêu Cầu 9: Chat Với Công Ty Cứu Hộ

**User Story:** Là người dùng, tôi muốn chat và gửi ảnh cho công ty cứu hộ để chỉ đường hoặc trao đổi thêm chi tiết.

#### Tiêu Chí Chấp Nhận

1. WHEN RescueRequest được xác nhận THEN hệ thống mở kênh chat giữa User và RescueCompany.
2. THE System SHALL cho phép gửi tin nhắn văn bản và hình ảnh trong kênh chat.
3. WHEN người nhận đang offline THEN hệ thống lưu ChatMessage và gửi Notification khi người nhận trực tuyến trở lại.
4. WHEN RescueRequest chuyển sang trạng thái "Hoàn tất" THEN hệ thống đóng kênh chat và lưu lịch sử tin nhắn.

---

### Yêu Cầu 10: Đánh Giá Dịch Vụ

**User Story:** Là người dùng, tôi muốn đánh giá 1-5 sao và viết nhận xét sau khi sử dụng dịch vụ để chia sẻ trải nghiệm.

#### Tiêu Chí Chấp Nhận

1. WHEN RescueRequest chuyển sang trạng thái "Hoàn tất" THEN hệ thống gửi lời mời đánh giá đến User.
2. THE System SHALL cho phép User gửi Rating từ 1 đến 5 sao kèm nhận xét văn bản.
3. IF người dùng chưa chọn số sao WHEN bấm gửi đánh giá THEN hệ thống không cho phép gửi và hiển thị thông báo.
4. THE System SHALL chỉ cho phép User gửi một Rating cho mỗi RescueRequest đã hoàn tất.
5. IF người dùng đã gửi đánh giá trước đó THEN hệ thống hiển thị đánh giá đã gửi và không cho phép gửi lại.

---

### Yêu Cầu 11: Đăng Và Tìm Kiếm Bài Viết Cộng Đồng

**User Story:** Là người dùng, tôi muốn đăng bài chia sẻ mẹo tự sửa xe và tìm kiếm bài hướng dẫn theo loại sự cố để tự khắc phục các lỗi nhỏ.

#### Tiêu Chí Chấp Nhận

1. GIVEN người dùng đã đăng nhập WHEN truy cập chức năng đăng bài THEN hệ thống hiển thị form tạo bài viết.
2. IF người dùng chưa nhập nội dung WHEN bấm đăng bài THEN hệ thống không cho phép đăng và hiển thị thông báo.
3. WHEN người dùng tìm kiếm theo loại sự cố THEN hệ thống hiển thị danh sách bài viết phù hợp.
4. IF không có bài viết phù hợp THEN hệ thống hiển thị thông báo "Không tìm thấy bài viết".

---

## Phần 2: Yêu Cầu Dành Cho Công Ty Cứu Hộ

### Yêu Cầu 12: Đăng Ký Tài Khoản Doanh Nghiệp

**User Story:** Là công ty cứu hộ, tôi muốn đăng ký tài khoản với đầy đủ thông tin để được cấp phép hoạt động trên hệ thống.

#### Tiêu Chí Chấp Nhận

1. GIVEN công ty chưa có tài khoản WHEN nhập đầy đủ thông tin hợp lệ và gửi đăng ký THEN hệ thống tạo tài khoản ở trạng thái "Chờ duyệt" và hiển thị thông báo đăng ký thành công.
2. THE System SHALL yêu cầu các thông tin: tên công ty, địa chỉ, số điện thoại, phạm vi hoạt động và giấy phép kinh doanh.
3. IF công ty chưa nhập đầy đủ thông tin bắt buộc WHEN gửi đăng ký THEN hệ thống không cho phép gửi và hiển thị thông báo lỗi.
4. GIVEN tài khoản đã được tạo ở trạng thái "Chờ duyệt" WHEN công ty đăng nhập THEN hệ thống hiển thị trạng thái chờ duyệt và không cho phép sử dụng chức năng cứu hộ.

---

### Yêu Cầu 13: Quản Lý Thông Tin Công Ty

**User Story:** Là công ty cứu hộ, tôi muốn cập nhật thông tin công ty để đảm bảo thông tin trên hệ thống luôn chính xác.

#### Tiêu Chí Chấp Nhận

1. GIVEN công ty đã đăng nhập WHEN truy cập màn hình chỉnh sửa hồ sơ THEN hệ thống hiển thị form với đầy đủ thông tin cũ.
2. WHEN công ty thay đổi thông tin và bấm lưu THEN hệ thống cập nhật dữ liệu và tự động chuyển trạng thái tài khoản sang "Chờ xác minh".
3. GIVEN tài khoản đang ở trạng thái "Chờ xác minh" WHEN công ty truy cập chức năng nhận yêu cầu cứu hộ THEN hệ thống hiển thị cảnh báo yêu cầu chờ xác minh xong.

---

### Yêu Cầu 14: Nhận Thông Báo Phê Duyệt Tài Khoản

**User Story:** Là công ty cứu hộ đang chờ xác minh, tôi muốn nhận thông báo ngay khi hồ sơ được duyệt để bắt đầu tiếp nhận yêu cầu.

#### Tiêu Chí Chấp Nhận

1. WHEN Admin phê duyệt tài khoản công ty THEN hệ thống gửi Notification đến tài khoản công ty.
2. WHEN công ty nhận được thông báo phê duyệt và truy cập ứng dụng THEN toàn bộ các tính năng ở trạng thái sẵn sàng sử dụng.
3. THE System SHALL cập nhật trạng thái tài khoản thành "Đã xác minh" ngay khi Admin phê duyệt.

---

### Yêu Cầu 15: Quản Lý Danh Mục Dịch Vụ

**User Story:** Là công ty cứu hộ, tôi muốn tự thêm, sửa, xóa các gói dịch vụ kèm bảng giá để khách hàng dễ lựa chọn.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cung cấp danh mục dịch vụ mặc định: vá lốp, thay lốp, nạp nhiên liệu, kéo xe và sửa chữa tại chỗ.
2. THE RescueCompany SHALL có thể thêm, cập nhật và xóa dịch vụ kèm mức giá.
3. IF công ty nhập mức giá không hợp lệ THEN hệ thống hiển thị thông báo lỗi và không cho phép lưu.
4. WHEN công ty xóa dịch vụ đang có trong RescueRequest chưa hoàn tất THEN hệ thống giữ nguyên thông tin dịch vụ đó trong yêu cầu hiện tại.

---

### Yêu Cầu 16: Quản Lý Phương Tiện Cứu Hộ

**User Story:** Là công ty cứu hộ, tôi muốn khai báo và quản lý danh sách xe cứu hộ để tiện điều phối.

#### Tiêu Chí Chấp Nhận

1. THE RescueCompany SHALL có thể thêm, cập nhật và xóa thông tin RescueVehicle gồm: biển số xe, loại xe và tình trạng hoạt động.
2. IF biển số xe đã tồn tại trong danh sách WHEN thêm xe mới THEN hệ thống không cho phép và hiển thị thông báo biển số đã tồn tại.
3. WHEN RescueVehicle được gán cho một RescueRequest THEN hệ thống tự động cập nhật trạng thái xe thành "Đang bận".
4. WHEN RescueRequest hoàn tất hoặc bị hủy THEN hệ thống tự động cập nhật trạng thái xe về "Sẵn sàng".
5. IF công ty cố gắng gán xe đang "Đang bận" vào yêu cầu mới THEN hệ thống không cho phép và hiển thị cảnh báo.

---

### Yêu Cầu 17: Nhận Và Xử Lý Yêu Cầu Cứu Hộ

**User Story:** Là công ty cứu hộ, tôi muốn nhận thông báo ngay khi có yêu cầu mới và bấm xác nhận hoặc từ chối trong vòng 10 phút.

#### Tiêu Chí Chấp Nhận

1. WHEN có RescueRequest mới THEN hệ thống gửi Notification ngay lập tức kèm thông tin: vị trí sự cố, loại dịch vụ và mô tả tình trạng xe.
2. THE System SHALL hiển thị hai lựa chọn "Xác nhận" và "Từ chối" kèm đếm ngược 10 phút.
3. WHEN công ty bấm "Xác nhận" THEN hệ thống ghi nhận và gửi Notification đến User.
4. WHEN công ty bấm "Từ chối" THEN hệ thống ghi nhận và gửi Notification đến User.
5. IF công ty không phản hồi trong 10 phút THEN hệ thống tự động đánh dấu "Không phản hồi" và gợi ý User chọn đơn vị khác.
6. GIVEN yêu cầu đã được xử lý THEN hệ thống không cho phép thực hiện lại hành động xác nhận/từ chối.

---

### Yêu Cầu 18: Cung Cấp ETA Và Hoàn Tất Dịch Vụ

**User Story:** Là công ty cứu hộ, tôi muốn nhập thời gian dự kiến đến và xác nhận hoàn tất kèm thông tin thanh toán.

#### Tiêu Chí Chấp Nhận

1. WHEN công ty xác nhận RescueRequest THEN hệ thống yêu cầu nhập ETA (số phút dự kiến đến hiện trường).
2. IF giá trị ETA không hợp lệ THEN hệ thống không chấp nhận và hiển thị thông báo lỗi.
3. WHEN công ty chọn "Hoàn tất" THEN hệ thống hiển thị form nhập thông tin thanh toán (số tiền, phương thức).
4. IF thông tin thanh toán không hợp lệ hoặc thiếu THEN hệ thống không cho phép hoàn tất và hiển thị thông báo lỗi.
5. WHEN hoàn tất thành công THEN hệ thống cập nhật trạng thái yêu cầu thành "Hoàn tất" và gửi Notification đến User.

---

### Yêu Cầu 19: Chat Với Khách Hàng

**User Story:** Là công ty cứu hộ, tôi muốn chat với khách hàng đang đợi để trấn an hoặc hỏi thêm chi tiết đường đi.

#### Tiêu Chí Chấp Nhận

1. WHEN công ty mở chức năng chat THEN hệ thống hiển thị giao diện chat và lịch sử tin nhắn (nếu có).
2. WHEN công ty gửi tin nhắn THEN hệ thống gửi và hiển thị nội dung trong khung chat theo thời gian thực.
3. IF nội dung tin nhắn rỗng THEN hệ thống không cho phép gửi.
4. THE System SHALL đảm bảo chỉ chat khi yêu cầu đang ở trạng thái hợp lệ.

---

### Yêu Cầu 20: Phản Hồi Đánh Giá Của Khách

**User Story:** Là công ty cứu hộ, tôi muốn viết phản hồi lại nhận xét của khách hàng để bảo vệ uy tín thương hiệu.

#### Tiêu Chí Chấp Nhận

1. WHEN công ty chọn một nhận xét THEN hệ thống hiển thị chức năng viết phản hồi.
2. WHEN công ty nhập nội dung hợp lệ và gửi THEN hệ thống lưu và hiển thị phản hồi gắn với nhận xét tương ứng.
3. IF nội dung phản hồi rỗng THEN hệ thống không cho phép gửi.
4. THE System SHALL đảm bảo mỗi đánh giá chỉ được phản hồi một lần bởi công ty cứu hộ.

---

## Phần 3: Yêu Cầu Dành Cho Quản Trị Viên

### Yêu Cầu 21: Đăng Nhập Quản Trị Viên

**User Story:** Là quản trị viên, tôi muốn đăng nhập bằng tài khoản được cấp sẵn để truy cập giao diện quản trị riêng biệt.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL khởi tạo sẵn tài khoản Admin trong cơ sở dữ liệu khi hệ thống được triển khai lần đầu, không có chức năng đăng ký Admin từ giao diện.
2. WHEN Admin đăng nhập thành công THEN hệ thống nhận diện role "admin" và chuyển hướng đến giao diện quản trị riêng biệt.
3. THE System SHALL ngăn User thông thường hoặc RescueCompany truy cập vào các trang quản trị.

---

### Yêu Cầu 22: Quản Lý Tài Khoản Người Dùng

**User Story:** Là quản trị viên, tôi muốn duy trì thông tin và hỗ trợ các vấn đề đăng nhập, bảo mật của người dùng.

#### Tiêu Chí Chấp Nhận

1. GIVEN Admin truy cập danh sách người dùng WHEN chọn một tài khoản THEN hệ thống hiển thị thông tin hồ sơ và trạng thái tài khoản.
2. WHEN Admin thực hiện "Khóa tài khoản" THEN hệ thống khóa tài khoản và gửi Notification đến chủ tài khoản nêu rõ lý do.
3. WHEN Admin thực hiện "Mở khóa tài khoản" THEN hệ thống cập nhật trạng thái thành "Hoạt động".
4. IF tài khoản bị khóa THEN hệ thống ngăn tài khoản đó đăng nhập.

---

### Yêu Cầu 23: Xác Minh Tài Khoản Công Ty Cứu Hộ

**User Story:** Là quản trị viên, tôi muốn xác minh danh tính và kiểm tra giấy phép kinh doanh của các công ty cứu hộ.

#### Tiêu Chí Chấp Nhận

1. WHEN Admin truy cập hồ sơ một công ty THEN hệ thống hiển thị thông tin doanh nghiệp và giấy phép đã tải lên.
2. WHEN Admin xác nhận giấy phép hợp lệ THEN hệ thống cập nhật trạng thái thành "Đã xác minh" và gửi Notification đến công ty.
3. IF giấy phép không hợp lệ WHEN Admin từ chối THEN hệ thống cập nhật trạng thái "Bị từ chối" và gửi Notification kèm lý do đến công ty.
4. THE System SHALL ghi nhận lịch sử xác minh (người thực hiện, thời gian, kết quả).

---

### Yêu Cầu 24: Kiểm Duyệt Nội Dung

**User Story:** Là quản trị viên, tôi muốn kiểm duyệt các đánh giá và bài đăng để đảm bảo không vi phạm quy định.

#### Tiêu Chí Chấp Nhận

1. WHEN Admin truy cập màn hình quản lý nội dung THEN hệ thống hiển thị danh sách các đánh giá, phản hồi và bài đăng.
2. WHEN Admin chọn "Gỡ nội dung" THEN hệ thống yêu cầu nhập lý do trước khi xác nhận.
3. WHEN Admin xác nhận gỡ nội dung THEN hệ thống ẩn nội dung và gửi Notification đến người đăng kèm lý do.
4. THE System SHALL ghi nhận lịch sử kiểm duyệt (người thực hiện, thời gian, lý do).

---

### Yêu Cầu 25: Báo Cáo Và Thống Kê

**User Story:** Là quản trị viên, tôi muốn xem báo cáo hoạt động và thống kê chất lượng dịch vụ để đánh giá hiệu quả hệ thống.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cung cấp bảng điều khiển thống kê hiển thị: tổng số RescueRequest theo ngày/tuần/tháng, tỷ lệ hoàn tất và tỷ lệ hủy.
2. WHEN Admin chọn khoảng thời gian THEN hệ thống cập nhật dữ liệu báo cáo tương ứng.
3. THE System SHALL hiển thị xếp hạng RescueCompany theo điểm đánh giá trung bình và số lượng yêu cầu đã xử lý.
4. THE System SHALL cho phép Admin xuất báo cáo dưới định dạng CSV hoặc PDF.
5. IF khoảng thời gian không hợp lệ THEN hệ thống hiển thị thông báo lỗi và không thực hiện truy vấn.
