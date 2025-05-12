
# 🎬 CinemaGo

**CinemaGo** là ứng dụng đặt vé xem phim trực tuyến, giúp bạn dễ dàng chọn phim yêu thích, đặt vé và tận hưởng trải nghiệm rạp chiếu mà không cần phải xếp hàng chờ đợi. 🍿

---

## 🌟 Tính năng nổi bật

### 🎞️ Danh sách phim
- Xem thông tin chi tiết về các bộ phim đang chiếu.
- Tìm kiếm phim theo tên một cách dễ dàng. ###(Làm chưa tới)

### 🎟️ Đặt vé
- Chọn ghế ngồi theo ý thích (nếu chưa bị "ai đó" đặt mất trước 🚀).
- Thanh toán nhanh chóng và tiện lợi. ###(Làm chưa tới)

### 👤 Quản lý tài khoản
- Đăng ký / Đăng nhập tài khoản.
- Theo dõi lịch sử đặt vé cá nhân.

### 🏢 Tích hợp rạp chiếu
- Cập nhật lịch chiếu từ các rạp phim nổi tiếng. ###(Làm chưa tới)

### 🖥️ Giao diện thân thiện
- Thiết kế trực quan, dễ sử dụng kể cả với người mới.

---

## 🛠️ Công nghệ sử dụng

| Thành phần     | Công nghệ              |
|----------------|------------------------|
| Back-end       | Java (Spring Boot)     |
| Front-end      | JavaScript, HTML, CSS  |
| Cơ sở dữ liệu  | MySQL                  |

---

## 🚀 Hướng dẫn chạy dự án

### 1. Yêu cầu hệ thống
- **Java:** Phiên bản 17 hoặc mới hơn
- **Node.js:** Phiên bản 16 hoặc mới hơn
- **MySQL:** Đã cài đặt và đang chạy

### 2. Các bước thực hiện

#### 📥 Bước 1: Clone repository
```bash
git clone https://github.com/ThuongWr19/CinemaGo.git
cd CinemaGo
```

#### ⚙️ Bước 2: Cấu hình cơ sở dữ liệu
- Mở file `application.properties` tại `src/main/resources`.
- Cập nhật thông tin kết nối MySQL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cinema_go
spring.datasource.username=<tên người dùng>
spring.datasource.password=<mật khẩu>
```

#### ▶️ Bước 3: Chạy back-end
```bash
./mvnw spring-boot:run
```

#### 🌐 Bước 4: Chạy front-end
```bash
cd frontend
npm install
npm start
```

#### 🔗 Bước 5: Truy cập ứng dụng
- Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000) (hoặc cổng đã được cấu hình).

---

## 📬 Đóng góp

Nếu bạn muốn cải thiện ứng dụng này, hãy **tạo Pull Request** hoặc **mở Issue** để cùng thảo luận và phát triển nhé! 💬

---

## 📜 Giấy phép

Dự án sử dụng **giấy phép MIT**. Bạn có thể thoải mái sử dụng, chỉnh sửa và phát triển thêm theo nhu cầu.

---

🎉 **Chúc bạn có trải nghiệm tuyệt vời cùng CinemaGo!**
