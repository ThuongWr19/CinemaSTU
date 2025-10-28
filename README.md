
# **CinemaSTU**

**CinemaGo** là ứng dụng đặt vé xem phim trực tuyến, giúp bạn dễ dàng chọn phim yêu thích, đặt vé và tận hưởng trải nghiệm rạp chiếu mà không cần phải xếp hàng chờ đợi.

---

## Tính năng nổi bật

### Danh sách phim
- Xem thông tin chi tiết về các bộ phim đang chiếu.

### Đặt vé
- Chọn ghế ngồi theo ý thích (nếu chưa bị "ai đó" đặt mất trước).

### Quản lý tài khoản
- Đăng ký / Đăng nhập tài khoản.
- Theo dõi lịch sử đặt vé cá nhân.

### Giao diện thân thiện
- Thiết kế trực quan, dễ sử dụng kể cả với người mới.

---
## Công nghệ sử dụng

| Thành phần     | Công nghệ              |
|----------------|------------------------|
| Back-end       | Java (Spring Boot)     |
| Front-end      | JavaScript, HTML, CSS  |
| Cơ sở dữ liệu  | MySQL                  |

---

## Hướng dẫn chạy dự án

### 1. Yêu cầu hệ thống
- **Java:** Phiên bản 17 hoặc mới hơn
- **Node.js:** Phiên bản 16 hoặc mới hơn
- **MySQL:** Đã cài đặt và đang chạy

### 2. Các bước thực hiện

#### Bước 1: Clone repository
```bash
git clone https://github.com/ThuongWr19/CinemaSTU.git
cd CinemaGo
```

#### Bước 2: Cấu hình cơ sở dữ liệu
- Mở file `application.properties` tại `src/main/resources`.
- Cập nhật thông tin kết nối MySQL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cinemastu
spring.datasource.username=<tên người dùng>
spring.datasource.password=<mật khẩu>
```

#### Bước 3: Chạy back-end
Vào folder backend chạy file .bat
```bash
./mvnw spring-boot:run
```

#### Bước 4: Chạy front-end
```bash
B1: Cài Wampserver, chạy wampserver, import file sql vào tên cinemastu
B2: nhét folder CinemaSTU vào C:\wamp64\www\
```

#### Bước 5: Truy cập ứng dụng
- Mở trình duyệt và truy cập: [http://localhost/CinemaSTU](http://localhost/CinemaSTU).

---

## Giấy phép

Dự án sử dụng **giấy phép MIT**. Bạn có thể thoải mái sử dụng, chỉnh sửa và phát triển thêm theo nhu cầu.

