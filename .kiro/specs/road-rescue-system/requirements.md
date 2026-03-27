# Tài Liệu Yêu Cầu Hệ Thống

## Giới Thiệu

Hệ thống Hỗ Trợ Sự Cố Xe Trên Đường (Road Rescue System) là một nền tảng số kết nối người tham gia giao thông gặp sự cố với các đơn vị cứu hộ chuyên nghiệp. Hệ thống được xây dựng trên nền tảng React + Vite (frontend), Node.js (backend) và MongoDB Atlas (database), hỗ trợ ba nhóm người dùng chính: người dùng cá nhân, công ty cứu hộ và quản trị viên hệ thống.

---

## Bảng Thuật Ngữ

- **System**: Hệ thống Hỗ Trợ Sự Cố Xe Trên Đường (Road Rescue System)
- **User**: Người dùng cá nhân đã đăng ký tài khoản, gặp sự cố xe và cần hỗ trợ
- **RescueCompany**: Công ty/đơn vị cung cấp dịch vụ cứu hộ giao thông đã được xác minh
- **Admin**: Quản trị viên hệ thống có quyền quản lý toàn bộ nền tảng
- **RescueRequest**: Yêu cầu cứu hộ do User tạo ra, chứa thông tin sự cố và vị trí
- **ServiceCatalog**: Danh mục các loại dịch vụ cứu hộ (vá lốp, thay lốp, nạp nhiên liệu, kéo xe, sửa chữa tại chỗ)
- **RescueVehicle**: Phương tiện cứu hộ thuộc sở hữu của RescueCompany
- **GPS_Location**: Tọa độ địa lý (vĩ độ, kinh độ) xác định vị trí sự cố
- **ChatMessage**: Tin nhắn trao đổi giữa User và RescueCompany trong một RescueRequest
- **Rating**: Đánh giá chất lượng dịch vụ do User gửi sau khi RescueRequest hoàn tất
- **Notification**: Thông báo thời gian thực gửi đến User hoặc RescueCompany
- **AuthService**: Dịch vụ xác thực và phân quyền người dùng
- **ContentModerator**: Thành phần kiểm duyệt nội dung đánh giá và phản hồi

---

## Yêu Cầu

### Yêu Cầu 1: Quản Lý Tài Khoản Người Dùng

**User Story:** Là một người tham gia giao thông, tôi muốn đăng ký và đăng nhập vào hệ thống, để có thể gửi yêu cầu cứu hộ khi gặp sự cố.

#### Tiêu Chí Chấp Nhận

1. THE AuthService SHALL cho phép User đăng ký tài khoản bằng email và mật khẩu.
2. WHEN User cung cấp email đã tồn tại trong hệ thống, THE AuthService SHALL trả về thông báo lỗi "Email đã được sử dụng".
3. WHEN User đăng nhập thành công, THE AuthService SHALL cấp phát JWT token có thời hạn 24 giờ.
4. IF User cung cấp thông tin đăng nhập không hợp lệ, THEN THE AuthService SHALL trả về mã lỗi 401 và thông báo "Thông tin đăng nhập không chính xác".
5. WHEN User yêu cầu đặt lại mật khẩu, THE AuthService SHALL hỗ trợ User đặt lại mật khẩu.
6. THE AuthService SHALL mã hóa mật khẩu bằng thuật toán bcrypt trước khi lưu vào cơ sở dữ liệu.

### Yêu Cầu 2: Quản Lý Tài Khoản Công Ty Cứu Hộ

**User Story:** Là một công ty cứu hộ, tôi muốn đăng ký và quản lý hồ sơ doanh nghiệp trên hệ thống, để có thể tiếp nhận và xử lý các yêu cầu cứu hộ từ khách hàng.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cho phép RescueCompany đăng ký tài khoản với các thông tin: tên công ty, địa chỉ, số điện thoại, phạm vi hoạt động và số giấy phép kinh doanh.
2. WHEN RescueCompany nộp hồ sơ đăng ký, THE System SHALL chuyển trạng thái tài khoản sang "Chờ xác minh" và thông báo cho Admin.
3. WHEN Admin xác minh thành công hồ sơ RescueCompany, THE System SHALL kích hoạt tài khoản và gửi thông báo xác nhận đến RescueCompany.
4. IF RescueCompany cung cấp giấy phép kinh doanh không hợp lệ hoặc đã hết hạn, THEN THE Admin SHALL từ chối hồ sơ và gửi thông báo lý do từ chối.
5. WHILE tài khoản RescueCompany ở trạng thái "Chờ xác minh", THE System SHALL ngăn RescueCompany tiếp nhận yêu cầu cứu hộ.
6. THE System SHALL cho phép RescueCompany cập nhật thông tin hồ sơ sau khi đã được xác minh.

---

### Yêu Cầu 3: Quản Lý Danh Mục Dịch Vụ Cứu Hộ

**User Story:** Là một công ty cứu hộ, tôi muốn quản lý danh mục dịch vụ và chi phí, để người dùng có thể lựa chọn dịch vụ phù hợp với nhu cầu.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cung cấp danh mục dịch vụ mặc định bao gồm: vá lốp, thay lốp, nạp nhiên liệu, kéo xe và sửa chữa tại chỗ.
2. THE RescueCompany SHALL có thể thêm, cập nhật và xóa dịch vụ trong danh mục của công ty kèm theo mức giá cụ thể.
3. WHEN RescueCompany xóa một dịch vụ đang có trong RescueRequest chưa hoàn tất, THE System SHALL giữ nguyên thông tin dịch vụ đó trong RescueRequest hiện tại.
4. THE System SHALL hiển thị danh sách dịch vụ của RescueCompany kèm mức giá cho User khi tìm kiếm.
5. IF RescueCompany nhập mức giá âm hoặc bằng 0, THEN THE System SHALL trả về thông báo lỗi "Mức giá không hợp lệ".

---

### Yêu Cầu 4: Quản Lý Phương Tiện Cứu Hộ

**User Story:** Là một công ty cứu hộ, tôi muốn quản lý đội phương tiện cứu hộ, để có thể điều phối xe phù hợp cho từng yêu cầu.

#### Tiêu Chí Chấp Nhận

1. THE RescueCompany SHALL có thể thêm, cập nhật và xóa thông tin RescueVehicle bao gồm: biển số xe, loại xe, tình trạng hoạt động và thiết bị hỗ trợ.
2. WHILE RescueVehicle đang được giao nhiệm vụ xử lý một RescueRequest, THE System SHALL hiển thị trạng thái "Đang bận" cho phương tiện đó.
3. WHEN RescueRequest được hoàn tất, THE System SHALL cập nhật trạng thái RescueVehicle về "Sẵn sàng".
4. IF RescueCompany cố gắng giao nhiệm vụ cho RescueVehicle đang ở trạng thái "Đang bận", THEN THE System SHALL hiển thị cảnh báo xác nhận trước khi thực hiện.

---

### Yêu Cầu 5: Gửi Yêu Cầu Cứu Hộ

**User Story:** Là một người dùng gặp sự cố xe, tôi muốn gửi yêu cầu cứu hộ với đầy đủ thông tin sự cố và vị trí, để đơn vị cứu hộ có thể đến hỗ trợ nhanh chóng.

#### Tiêu Chí Chấp Nhận

1. WHEN User đã đăng nhập và chọn loại dịch vụ, THE System SHALL hiển thị biểu mẫu nhập thông tin sự cố bao gồm: mô tả tình trạng xe, vị trí và tùy chọn đính kèm hình ảnh.
2. THE System SHALL tự động lấy GPS_Location từ thiết bị của User nếu User cấp quyền truy cập vị trí.
3. IF User không cấp quyền truy cập vị trí, THEN THE System SHALL cho phép User nhập địa chỉ thủ công theo cấu trúc: Tỉnh/Thành phố → Quận/Huyện → Xã/Phường → Số nhà/Tên đường, với các ô chọn cascade để hệ thống có thể xác định tọa độ.
4. THE System SHALL cho phép User đính kèm 1 hình ảnh mô tả tình trạng xe.
5. IF User gửi RescueRequest mà không cung cấp vị trí, THEN THE System SHALL hiển thị thông báo lỗi yêu cầu cung cấp vị trí sự cố.

---

### Yêu Cầu 6: Tìm Kiếm Và Chọn Đơn Vị Cứu Hộ

**User Story:** Là một người dùng gặp sự cố, tôi muốn xem danh sách các đơn vị cứu hộ gần nhất kèm thông tin đánh giá, để chọn được dịch vụ phù hợp và đáng tin cậy.

#### Tiêu Chí Chấp Nhận

1. WHEN User cung cấp GPS_Location và chọn loại dịch vụ, THE System SHALL trả về danh sách RescueCompany trong bán kính 50km có cung cấp dịch vụ tương ứng, sắp xếp theo khoảng cách tăng dần.
2. THE System SHALL hiển thị cho mỗi RescueCompany trong danh sách: tên công ty, khoảng cách, mức giá dịch vụ, điểm đánh giá trung bình và số lượng đánh giá.
3. IF không có RescueCompany nào trong bán kính 50km, THEN THE System SHALL thông báo "Không tìm thấy đơn vị cứu hộ trong khu vực" và gợi ý mở rộng phạm vi tìm kiếm.
4. WHEN User chọn một RescueCompany và xác nhận gửi yêu cầu, THE System SHALL tạo RescueRequest và gửi Notification đến RescueCompany.
5. THE System SHALL chỉ hiển thị các RescueCompany có trạng thái tài khoản "Đã xác minh" và đang hoạt động.

---

### Yêu Cầu 7: Theo Dõi Yêu Cầu Cứu Hộ Theo Thời Gian Thực

**User Story:** Là một người dùng đã gửi yêu cầu cứu hộ, tôi muốn theo dõi trạng thái xử lý theo thời gian thực, để biết được tiến độ và thời gian đơn vị cứu hộ đến nơi.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cập nhật trạng thái RescueRequest theo các bước: "Chờ xác nhận" → "Đã xác nhận" → "Đang xử lý" → "Hoàn tất".
2. WHEN RescueCompany xác nhận yêu cầu và cung cấp thời gian dự kiến đến, THE System SHALL gửi Notification đến User.
3. WHILE RescueRequest ở trạng thái "Đang xử lý", THE System SHALL hiển thị thời gian dự kiến đến và cho phép User theo dõi vị trí phương tiện cứu hộ trên bản đồ.
4. WHEN trạng thái RescueRequest thay đổi, THE System SHALL gửi Notification đến User.
5. THE System SHALL lưu lịch sử toàn bộ các thay đổi trạng thái của RescueRequest kèm thời gian.

---

### Yêu Cầu 8: Hủy Yêu Cầu Cứu Hộ

**User Story:** Là một người dùng, tôi muốn có thể hủy yêu cầu cứu hộ khi không còn cần thiết, để tránh lãng phí nguồn lực của đơn vị cứu hộ.

#### Tiêu Chí Chấp Nhận

1. WHEN RescueRequest ở trạng thái "Chờ xác nhận", THE System SHALL cho phép User hủy yêu cầu mà không cần lý do.
2. WHEN RescueRequest ở trạng thái "Đã xác nhận" hoặc "Đang xử lý", THE System SHALL yêu cầu User cung cấp lý do hủy trước khi xác nhận hủy.
3. WHEN User hủy RescueRequest, THE System SHALL gửi Notification đến RescueCompany
4. IF RescueRequest đã ở trạng thái "Hoàn tất", THEN THE System SHALL ngăn User thực hiện hủy yêu cầu.
5. THE System SHALL ghi nhận lịch sử hủy yêu cầu kèm lý do và thời gian.

---

### Yêu Cầu 9: Tiếp Nhận Và Xử Lý Yêu Cầu Của Công Ty Cứu Hộ

**User Story:** Là một công ty cứu hộ, tôi muốn tiếp nhận, xác nhận và cập nhật tiến độ xử lý yêu cầu, để cung cấp dịch vụ hiệu quả và minh bạch cho khách hàng.

#### Tiêu Chí Chấp Nhận

1. WHEN RescueCompany nhận được RescueRequest mới, THE System SHALL hiển thị Notification kèm thông tin chi tiết: vị trí sự cố, loại dịch vụ, mô tả tình trạng xe.
2. THE RescueCompany SHALL có thể xác nhận hoặc từ chối RescueRequest trong vòng 10 phút kể từ khi nhận được.
3. IF RescueCompany không phản hồi RescueRequest trong 10 phút, THEN THE System SHALL tự động chuyển trạng thái yêu cầu về "Chờ xác nhận" và gợi ý User chọn đơn vị khác.
4. WHEN RescueCompany xác nhận RescueRequest, THE RescueCompany SHALL cung cấp thời gian dự kiến đến hiện trường.
5. THE RescueCompany SHALL có thể cập nhật trạng thái xử lý và ghi chú tiến độ trong suốt quá trình thực hiện.
6. WHEN RescueCompany hoàn tất dịch vụ, THE System SHALL yêu cầu RescueCompany xác nhận hoàn thành và ghi nhận thông tin thanh toán.

---

### Yêu Cầu 10: Hệ Thống Nhắn Tin

**User Story:** Là người dùng hoặc công ty cứu hộ, tôi muốn trao đổi trực tiếp qua tin nhắn trong yêu cầu cứu hộ, để phối hợp xử lý sự cố hiệu quả hơn.

#### Tiêu Chí Chấp Nhận

1. WHEN RescueRequest được xác nhận bởi RescueCompany, THE System SHALL mở kênh chat giữa User và RescueCompany cho yêu cầu đó.
2. THE System SHALL gửi ChatMessage đến người nhận từ người gửi gửi tin.
3. WHEN người nhận đang offline, THE System SHALL lưu ChatMessage và gửi Notification khi người nhận trực tuyến trở lại.
4. THE System SHALL cho phép gửi tin nhắn văn bản và hình ảnh trong kênh chat.
5. WHEN RescueRequest chuyển sang trạng thái "Hoàn tất", THE System SHALL đóng kênh chat và lưu lịch sử tin nhắn.
6. IF User hoặc RescueCompany gửi nội dung vi phạm quy định, THEN THE ContentModerator SHALL ẩn tin nhắn và gửi cảnh báo đến người gửi.

---

### Yêu Cầu 11: Hệ Thống Đánh Giá Và Phản Hồi

**User Story:** Là một người dùng, tôi muốn đánh giá chất lượng dịch vụ sau khi hoàn tất, để giúp người dùng khác lựa chọn đơn vị cứu hộ uy tín.

#### Tiêu Chí Chấp Nhận

1. WHEN RescueRequest chuyển sang trạng thái "Hoàn tất", THE System SHALL gửi lời mời đánh giá đến User.
2. THE System SHALL cho phép User gửi Rating từ 1 đến 5 sao kèm nhận xét văn bản cho RescueRequest đã hoàn tất.
3. THE System SHALL tính điểm đánh giá trung bình của RescueCompany dựa trên tất cả các Rating đã nhận.
4. WHEN User gửi Rating, THE ContentModerator SHALL kiểm tra nội dung nhận xét trước khi hiển thị công khai.
5. IF nội dung nhận xét vi phạm quy định cộng đồng, THEN THE ContentModerator SHALL ẩn nhận xét và thông báo cho User lý do.
6. THE System SHALL chỉ cho phép User gửi một Rating cho mỗi RescueRequest đã hoàn tất.
7. WHERE RescueCompany muốn phản hồi đánh giá, THE RescueCompany SHALL có thể gửi một phản hồi duy nhất cho mỗi Rating.

---

### Yêu Cầu 12: Hỗ Trợ Tư Vấn Từ Cộng Đồng

**User Story:** Là một người tham gia giao thông, tôi muốn chia sẻ hướng dẫn xử lý sự cố đơn giản, để giúp đỡ những người gặp sự cố nhỏ có thể tự xử lý.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cung cấp diễn đàn cộng đồng nơi người dùng đã xác thực có thể đăng bài hướng dẫn xử lý sự cố xe.
2. WHEN người dùng đăng bài hướng dẫn, THE ContentModerator SHALL kiểm duyệt nội dung trước khi hiển thị công khai trong vòng 24 giờ.
3. THE System SHALL cho phép User tìm kiếm bài hướng dẫn theo loại sự cố hoặc từ khóa.
4. IF nội dung bài đăng vi phạm quy định, THEN THE ContentModerator SHALL từ chối bài đăng và thông báo lý do cho người đăng.
5. THE System SHALL hiển thị số lượt xem và lượt hữu ích cho mỗi bài hướng dẫn.

---

### Yêu Cầu 13: Quản Trị Hệ Thống - Kiểm Duyệt Nội Dung

**User Story:** Là quản trị viên, tôi muốn kiểm soát nội dung trên nền tảng, để đảm bảo môi trường an toàn và đáng tin cậy cho tất cả người dùng.

#### Tiêu Chí Chấp Nhận

1. THE Admin SHALL có thể xem, ẩn hoặc xóa bất kỳ Rating, nhận xét hoặc bài đăng cộng đồng nào vi phạm quy định.
2. WHEN Admin xử lý nội dung vi phạm, THE System SHALL ghi nhận hành động kiểm duyệt kèm lý do và thời gian.
3. THE Admin SHALL có thể khóa tài khoản User hoặc RescueCompany vi phạm quy định sử dụng.
4. WHEN tài khoản bị khóa, THE System SHALL gửi thông báo đến chủ tài khoản nêu rõ lý do và thời hạn khóa.
5. IF User hoặc RescueCompany bị khóa tài khoản, THEN THE System SHALL ngăn tài khoản đó đăng nhập trong thời gian bị khóa.

---

### Yêu Cầu 14: Báo Cáo Và Thống Kê

**User Story:** Là quản trị viên, tôi muốn xem báo cáo và thống kê hoạt động của hệ thống, để đưa ra quyết định quản lý và cải thiện chất lượng dịch vụ.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cung cấp bảng điều khiển thống kê cho Admin hiển thị: tổng số RescueRequest theo ngày/tuần/tháng, tỷ lệ hoàn tất, tỷ lệ hủy và thời gian phản hồi trung bình.
2. THE System SHALL hiển thị xếp hạng RescueCompany theo điểm đánh giá trung bình và số lượng yêu cầu đã xử lý.
3. THE System SHALL cho phép Admin xuất báo cáo dưới định dạng CSV hoặc PDF cho khoảng thời gian tùy chọn.
4. WHEN Admin truy cập bảng thống kê, THE System SHALL tải và hiển thị dữ liệu.
5. THE System SHALL cập nhật dữ liệu thống kê theo thời gian thực khi có RescueRequest mới được tạo hoặc cập nhật trạng thái.

---

### Yêu Cầu 15: Thông Báo Thời Gian Thực

**User Story:** Là người dùng hoặc công ty cứu hộ, tôi muốn nhận thông báo tức thì về các sự kiện quan trọng, để không bỏ lỡ thông tin cần thiết.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL gửi Notification đến User khi: RescueRequest được xác nhận, trạng thái thay đổi, nhận ChatMessage mới và yêu cầu đánh giá.
2. THE System SHALL gửi Notification đến RescueCompany khi: nhận RescueRequest mới, User hủy yêu cầu và nhận ChatMessage mới.
3. WHEN người dùng đang sử dụng ứng dụng, THE System SHALL hiển thị Notification dạng in-app.
4. WHERE thiết bị hỗ trợ push notification, THE System SHALL gửi push notification khi người dùng không đang sử dụng ứng dụng.
5. THE System SHALL lưu lịch sử Notification và cho phép người dùng đánh dấu đã đọc.
