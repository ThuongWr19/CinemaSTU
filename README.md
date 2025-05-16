# CinemaGO

CinemaGO là một ứng dụng web quản lý rạp chiếu phim, cho phép người dùng xem danh sách phim, đặt vé, quản lý phim yêu thích và khám phá các khuyến mãi. Dự án được phát triển bằng Spring Boot (backend) và HTML/CSS/JavaScript (frontend).

## Chức năng chính
- **Danh sách phim**: Xem thông tin chi tiết về các bộ phim đang chiếu.
- **Lịch chiếu**: Kiểm tra lịch chiếu và số ghế trống tại các rạp.
- **Đặt vé**: Hỗ trợ đặt vé (chức năng đang trong quá trình phát triển).
- **Phim yêu thích**: Thêm/xóa phim vào danh sách yêu thích sau khi đăng nhập.
- **Khuyến mãi**: Cung cấp thông tin về các chương trình khuyến mãi.
- **Đăng nhập/Đăng ký**: Quản lý tài khoản người dùng.

## Hướng dẫn chạy dự án

### Yêu cầu
- **Java 11 hoặc cao hơn**
- **Maven 3.6+**
- **Node.js và http-server (cho frontend)**
- **MySQL**

### Thiết lập
1. **Cài đặt MySQL**:
   - Tạo database `cinemago`.
   - Chạy file `movies.sql` trong thư mục gốc để tạo bảng và chèn dữ liệu mẫu.

2. **Cấu hình backend**:
   - Mở file `cinemago-backend/src/main/resources/application.properties`.
   - Cập nhật thông tin kết nối MySQL:
     ```
     spring.datasource.url=jdbc:mysql://localhost:3306/cinemago
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```
   - Thay `your_username` và `your_password` bằng thông tin tài khoản MySQL của bạn.

3. **Chạy backend**:
   - Điều hướng đến thư mục `cinemago-backend`:
     ```
     cd cinemago-backend
     ```
   - Chạy dự án:
     ```
     mvn spring-boot:run
     ```
   - Backend sẽ chạy trên `http://localhost:8080`.

4. **Chạy frontend**:
   - Điều hướng đến thư mục `cinemago-frontend`:
     ```
     cd cinemago-frontend
     ```
   - Cài đặt http-server (nếu chưa có):
     ```
     npm install -g http-server
     ```
   - Chạy server frontend:
     ```
     http-server -p 8081
     ```
   - Truy cập `http://localhost:8081` trên trình duyệt.

### Lưu ý
- Đảm bảo cả backend và frontend đang chạy cùng lúc.
- API yêu cầu token xác thực cho các chức năng như quản lý phim yêu thích.

## Đóng góp
- Fork repository này.
- Tạo branch cho tính năng mới: `git checkout -b feature/ten-tinh-nang`.
- Commit thay đổi: `git commit -m "Mô tả thay đổi"`.
- Đẩy lên GitHub: `git push origin feature/ten-tinh-nang`.
- Tạo Pull Request.

## Giấy phép
Dự án này được phát hành dưới [MIT License](LICENSE).