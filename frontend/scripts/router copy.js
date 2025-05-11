class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.appContainer = document.getElementById('app-container');

        // Đăng ký sự kiện click cho tất cả các liên kết có thuộc tính data-route
        document.addEventListener('click', this.handleRouteClick.bind(this));

        // Xử lý sự kiện popstate khi người dùng nhấn nút Back/Forward trên trình duyệt
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                this.renderContent(e.state.route);
            }
        });

        // Xử lý URL ban đầu khi trang được tải
        window.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname.substring(1) || 'trangchu';
            this.navigate(path, true);
        });
    }

    // Xử lý click vào các liên kết có thuộc tính data-route
    handleRouteClick(e) {
        const target = e.target.matches('[data-route]') ? e.target : 
                      (e.target.parentElement && e.target.parentElement.matches('[data-route]') ? 
                      e.target.parentElement : null);
        
        if (target) {
            e.preventDefault();
            const route = target.getAttribute('data-route');
            this.navigate(route);
        }
    }

    // Phương thức để đăng ký một route mới
    addRoute(route, handler) {
        this.routes[route] = handler;
    }

    // Phương thức để chuyển hướng đến một route
    navigate(route, replaceState = false) {
        if (this.routes[route]) {
            // Cập nhật URL
            const stateMethod = replaceState ? 'replaceState' : 'pushState';
            window.history[stateMethod]({ route }, '', '/' + route);
            this.renderContent(route);
        } else {
            console.error(`Route không tồn tại: ${route}`);
            this.navigate('trangchu', true); // Chuyển về trang chủ nếu route không tồn tại
        }
    }

    // Phương thức để hiển thị nội dung theo route
    renderContent(route) {
        this.currentRoute = route;
        
        // Cập nhật trạng thái active cho các menu item
        document.querySelectorAll('[data-route]').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-route') === route);
        });

        // Gọi handler tương ứng để render nội dung
        if (this.routes[route]) {
            this.routes[route](this.appContainer);
        }
    }
}

// Khởi tạo router
const router = new Router();

// Đăng ký các route
router.addRoute('trangchu', (container) => {
    container.innerHTML = `
        <div class="text-center mt-2">
            <div id="slideshow" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner rounded-2">
                    <div class="carousel-item active">
                        <img src="/frontend/assets/Banner/DiaDao.jpg" class="d-block w-100" alt="..." />
                    </div>
                    <div class="carousel-item">
                        <img src="/frontend/assets/Banner/TimXac.jpg" class="d-block w-100" alt="..." />
                    </div>
                    <div class="carousel-item">
                        <img src="/frontend/assets/Banner/phim-hay-thang-4.png" class="d-block w-100" alt="..." />
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#slideshow" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#slideshow" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            <hr>
            <h1 class="display-5 text-uppercase fw-bolder mt-2">Phim đang chiếu</h1>
            <div id="movies-list" class="row row-cols-3 row-gap-4 card-group">
            </div>
        </div>
    `;
    
    // Gọi hàm lấy danh sách phim từ script.js
    getMovieList();
});

router.addRoute('datve', (container) => {
    container.innerHTML = `
        <div class="row mt-4">
            <div class="col-12">
                <h1 class="text-center">Đặt Vé Xem Phim</h1>
                <p class="text-center">Vui lòng chọn phim, ngày chiếu và giờ chiếu để tiếp tục.</p>
            </div>
            <div class="col-md-8 mx-auto mt-4">
                <div class="card">
                    <div class="card-body">
                        <form id="booking-form">
                            <div class="mb-3">
                                <label for="movie-select" class="form-label">Chọn Phim</label>
                                <select class="form-select" id="movie-select" required>
                                    <option value="" selected disabled>-- Chọn phim --</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="date-select" class="form-label">Chọn Ngày</label>
                                <input type="date" class="form-control" id="date-select" required>
                            </div>
                            <div class="mb-3">
                                <label for="time-select" class="form-label">Chọn Giờ</label>
                                <select class="form-select" id="time-select" required>
                                    <option value="" selected disabled>-- Chọn giờ --</option>
                                </select>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Tiếp tục</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Lấy danh sách phim cho form đặt vé
    loadMoviesForBooking();
});

router.addRoute('danhsachphim', (container) => {
    container.innerHTML = `
        <div class="row mt-4">
            <div class="col-12">
                <h1 class="text-center">Danh Sách Phim</h1>
                <div class="row mt-4">
                    <div class="col-md-4 mb-3">
                        <input type="text" class="form-control" id="search-movie" placeholder="Tìm kiếm phim...">
                    </div>
                    <div class="col-md-4 mb-3">
                        <select class="form-select" id="filter-genre">
                            <option value="">Tất cả thể loại</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="movies-grid" class="row row-cols-1 row-cols-md-4 g-4 mt-2">
                <!-- Danh sách phim sẽ được thêm vào đây bằng JavaScript -->
            </div>
        </div>
    `;
    
    // Gọi hàm lấy và hiển thị danh sách phim chi tiết
    loadAllMovies();
});

router.addRoute('dangnhap', (container) => {
    container.innerHTML = `
        <div class="row mt-5">
            <div class="col-md-6 mx-auto">
                <div class="card">
                    <div class="card-header text-center">
                        <h2>Đăng nhập</h2>
                    </div>
                    <div class="card-body">
                        <form id="login-form">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Mật khẩu</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="remember-me">
                                <label class="form-check-label" for="remember-me">Ghi nhớ đăng nhập</label>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
                            </div>
                        </form>
                        <div class="mt-3 text-center">
                            <p>Chưa có tài khoản? <a href="#" data-route="dangky">Đăng ký ngay</a></p>
                            <p><a href="#">Quên mật khẩu?</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Đăng ký sự kiện xử lý form đăng nhập
    document.getElementById('login-form').addEventListener('submit', handleLogin);
});

router.addRoute('dangky', (container) => {
    container.innerHTML = `
        <div class="row mt-5">
            <div class="col-md-6 mx-auto">
                <div class="card">
                    <div class="card-header text-center">
                        <h2>Đăng ký</h2>
                    </div>
                    <div class="card-body">
                        <form id="register-form">
                            <div class="mb-3">
                                <label for="fullname" class="form-label">Họ tên</label>
                                <input type="text" class="form-control" id="fullname" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="phone" class="form-label">Số điện thoại</label>
                                <input type="tel" class="form-control" id="phone" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Mật khẩu</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirm-password" class="form-label">Xác nhận mật khẩu</label>
                                <input type="password" class="form-control" id="confirm-password" required>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="terms" required>
                                <label class="form-check-label" for="terms">Tôi đồng ý với các điều khoản và điều kiện</label>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary w-100">Đăng ký</button>
                            </div>
                        </form>
                        <div class="mt-3 text-center">
                            <p>Đã có tài khoản? <a href="#" data-route="dangnhap">Đăng nhập</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Đăng ký sự kiện xử lý form đăng ký
    document.getElementById('register-form').addEventListener('submit', handleRegister);
});

router.addRoute('khuyenmai', (container) => {
    container.innerHTML = `
        <div class="row mt-4">
            <div class="col-12">
                <h1 class="text-center">Khuyến Mãi</h1>
                <p class="text-center">Các chương trình khuyến mãi đặc biệt từ CinemaGO</p>
            </div>
            <div class="row row-cols-1 row-cols-md-3 g-4 mt-2">
                <div class="col">
                    <div class="card h-100">
                        
                        <div class="card-body">
                            <h5 class="card-title">Mua 2 vé tặng 1 bánh ngọt</h5>
                            <p class="card-text">Áp dụng cho tất cả các suất chiếu từ thứ 2 đến thứ 6.</p>
                            <p><small class="text-muted">Hạn sử dụng: 30/06/2025</small></p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        
                        <div class="card-body">
                            <h5 class="card-title">Giảm 50% combo bắp nước</h5>
                            <p class="card-text">Áp dụng cho thành viên VIP vào ngày sinh nhật.</p>
                            <p><small class="text-muted">Hạn sử dụng: Không thời hạn</small></p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        
                        <div class="card-body">
                            <h5 class="card-title">Thứ tư vui vẻ - Giảm 30% giá vé</h5>
                            <p class="card-text">Áp dụng cho tất cả các suất chiếu vào thứ tư hàng tuần.</p>
                            <p><small class="text-muted">Hạn sử dụng: 31/12/2025</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
});

router.addRoute('lienhe', (container) => {
    container.innerHTML = `
        <div class="row mt-4">
            <div class="col-12">
                <h1 class="text-center">Liên Hệ</h1>
                <p class="text-center">Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc phản hồi nào.</p>
            </div>
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Gửi tin nhắn cho chúng tôi</h5>
                            <form id="contact-form">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Họ tên</label>
                                    <input type="text" class="form-control" id="name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                                <div class="mb-3">
                                    <label for="subject" class="form-label">Chủ đề</label>
                                    <input type="text" class="form-control" id="subject" required>
                                </div>
                                <div class="mb-3">
                                    <label for="message" class="form-label">Nội dung</label>
                                    <textarea class="form-control" id="message" rows="5" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Gửi tin nhắn</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Thông tin liên hệ</h5>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <i class="bi bi-geo-alt"></i> Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
                                </li>
                                <li class="list-group-item">
                                    <i class="bi bi-telephone"></i> Điện thoại: (028) 1234 5678
                                </li>
                                <li class="list-group-item">
                                    <i class="bi bi-envelope"></i> Email: hotro@cinemago.com
                                </li>
                                <li class="list-group-item">
                                    <i class="bi bi-clock"></i> Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày)
                                </li>
                            </ul>
                            <div class="mt-4">
                                <h6>Kết nối với chúng tôi</h6>
                                <div class="d-flex gap-3 mt-2">
                                    <a href="#" class="text-decoration-none"><i class="bi bi-facebook fs-4"></i></a>
                                    <a href="#" class="text-decoration-none"><i class="bi bi-instagram fs-4"></i></a>
                                    <a href="#" class="text-decoration-none"><i class="bi bi-twitter fs-4"></i></a>
                                    <a href="#" class="text-decoration-none"><i class="bi bi-youtube fs-4"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Đăng ký sự kiện xử lý form liên hệ
    document.getElementById('contact-form').addEventListener('submit', handleContactForm);
});

router.addRoute('chinhsach', (container) => {
    container.innerHTML = `
        <div class="row mt-4">
            <div class="col-12">
                <h1 class="text-center">Chính Sách</h1>
                <div class="card mt-4">
                    <div class="card-body">
                        <h3>Chính sách bảo mật</h3>
                        <p>CinemaGO cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ và không chia sẻ thông tin này với bên thứ ba mà không có sự đồng ý của khách hàng.</p>
                        
                        <h3 class="mt-4">Chính sách hoàn tiền</h3>
                        <p>Khách hàng có thể yêu cầu hoàn tiền trong vòng 30 phút sau khi đặt vé, với điều kiện suất chiếu chưa bắt đầu. Việc hoàn tiền sẽ được xử lý trong vòng 7 ngày làm việc.</p>
                        
                        <h3 class="mt-4">Chính sách đổi vé</h3>
                        <p>Khách hàng có thể đổi vé sang suất chiếu khác của cùng một bộ phim trong vòng 24 giờ trước giờ chiếu, với điều kiện còn chỗ ngồi. Phí đổi vé là 10% giá vé.</p>
                        
                        <h3 class="mt-4">Quy định sử dụng website</h3>
                        <p>Người dùng không được phép sử dụng bất kỳ phương tiện tự động nào để truy cập, thu thập thông tin hoặc tương tác với website của chúng tôi. Việc vi phạm có thể dẫn đến việc khóa tài khoản và các biện pháp pháp lý khác.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
});

router.addRoute('faq', (container) => {
    container.innerHTML = `
        <div class="row mt-4">
            <div class="col-12">
                <h1 class="text-center">Các Câu Hỏi Thường Gặp (FAQs)</h1>
                <div class="accordion mt-4" id="faqAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                Làm thế nào để đặt vé xem phim trực tuyến?
                            </button>
                        </h2>
                        <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Để đặt vé, bạn chỉ cần đăng nhập vào tài khoản, chọn phim, chọn ngày giờ và ghế ngồi mong muốn, sau đó tiến hành thanh toán. Sau khi thanh toán thành công, vé điện tử sẽ được gửi đến email của bạn.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                Tôi có thể hủy hoặc đổi vé đã đặt không?
                            </button>
                        </h2>
                        <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Bạn có thể hủy vé trong vòng 30 phút sau khi đặt và trước giờ chiếu phim. Đối với việc đổi vé, bạn có thể đổi sang suất chiếu khác của cùng một bộ phim trong vòng 24 giờ trước giờ chiếu, với điều kiện còn chỗ ngồi và chịu phí đổi vé là 10% giá vé.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                Làm thế nào để trở thành thành viên VIP?
                            </button>
                        </h2>
                        <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Để trở thành thành viên VIP, bạn cần đăng ký tài khoản và tích lũy ít nhất 500 điểm trong vòng 3 tháng. Mỗi 10.000 đồng chi tiêu sẽ được tính là 1 điểm. Thành viên VIP sẽ nhận được nhiều ưu đãi đặc biệt như giảm giá vé, ưu tiên đặt vé phim hot và các khuyến mãi độc quyền.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                Các phương thức thanh toán nào được chấp nhận?
                            </button>
                        </h2>
                        <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                CinemaGO chấp nhận nhiều phương thức thanh toán khác nhau bao gồm thẻ tín dụng/ghi nợ (Visa, MasterCard, JCB), các ví điện tử (MoMo, ZaloPay, VNPay), và chuyển khoản ngân hàng. Thanh toán sẽ được xử lý an toàn thông qua hệ thống bảo mật của chúng tôi.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
});

// Các hàm xử lý bổ sung
function loadMoviesForBooking() {
    try {
        fetch("http://localhost:8080/api/movies")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const movieSelect = document.getElementById("movie-select");
            if (!movieSelect) return;
            
            // Xóa tất cả options hiện tại trừ option mặc định đầu tiên
            while (movieSelect.options.length > 1) {
                movieSelect.remove(1);
            }
            
            // Thêm các bộ phim vào dropdown
            data.forEach((movie) => {
                const option = document.createElement("option");
                option.value = movie.id;
                option.textContent = movie.title;
                movieSelect.appendChild(option);
            });
            
            // Xử lý khi người dùng chọn phim
            movieSelect.addEventListener("change", function() {
                const selectedMovieId = this.value;
                if (selectedMovieId) {
                    loadShowtimes(selectedMovieId);
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching movies for booking:", error);
        });
    } catch (error) {
        console.error("Error in loadMoviesForBooking function:", error);
    }
}

function loadShowtimes(movieId) {
    // Mô phỏng tải lịch chiếu theo phim đã chọn
    const timeSelect = document.getElementById("time-select");
    if (!timeSelect) return;
    
    // Xóa tất cả options hiện tại trừ option mặc định đầu tiên
    while (timeSelect.options.length > 1) {
        timeSelect.remove(1);
    }
    
    // Thêm các giờ chiếu mẫu (trong thực tế, bạn sẽ lấy dữ liệu này từ API)
    const showtimes = [
        { id: 1, time: "10:00" },
        { id: 2, time: "13:30" },
        { id: 3, time: "16:45" },
        { id: 4, time: "20:00" },
        { id: 5, time: "22:30" }
    ];
    
    showtimes.forEach((showtime) => {
        const option = document.createElement("option");
        option.value = showtime.id;
        option.textContent = showtime.time;
        timeSelect.appendChild(option);
    });
}

function loadAllMovies() {
    try {
        fetch("http://localhost:8080/api/movies")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const moviesGrid = document.getElementById("movies-grid");
            if (!moviesGrid) return;
            
            moviesGrid.innerHTML = '';
            
            data.forEach((movie) => {
                const movieCard = document.createElement('div');
                movieCard.className = 'col';
                movieCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${movie.poster_url}" class="card-img-top" alt="${movie.title}"
                             onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">${movie.description || 'Không có mô tả'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="badge bg-primary">120 phút</span>
                                    <span class="badge bg-secondary">Hành động</span>
                                </div>
                                <button class="btn btn-sm btn-outline-primary" data-movie-id="${movie.id}">Chi tiết</button>
                            </div>
                        </div>
                    </div>
                `;
                moviesGrid.appendChild(movieCard);
            });
            
            // Thêm sự kiện cho các nút "Chi tiết"
            document.querySelectorAll('[data-movie-id]').forEach(btn => {
                btn.addEventListener('click', function() {
                    const movieId = this.getAttribute('data-movie-id');
                    showMovieDetails(movieId);
                });
            });
            
            if (data.length === 0) {
                moviesGrid.innerHTML = '<div class="col-12 text-center"><p>Không có phim nào</p></div>';
            }
        })
        .catch((error) => {
            console.error("Error loading all movies:", error);
            const moviesGrid = document.getElementById("movies-grid");
            if (moviesGrid) {
                moviesGrid.innerHTML = `
                    <div class="col-12 text-center">
                        <div class="alert alert-danger" role="alert">
                            Không thể tải danh sách phim. Vui lòng thử lại sau.
                        </div>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error("Error in loadAllMovies function:", error);
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Mô phỏng gửi dữ liệu đăng nhập
    console.log("Đang xử lý đăng nhập với:", { email, password, rememberMe });
    
    // Mô phỏng đăng nhập thành công và chuyển hướng
    alert("Đăng nhập thành công!");
    router.navigate('trangchu');
}

function handleRegister(event) {
    event.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }
    
    // Mô phỏng gửi dữ liệu đăng ký
    console.log("Đang xử lý đăng ký với:", { fullname, email, phone, password });
    
    // Mô phỏng đăng ký thành công và chuyển hướng
    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    router.navigate('dangnhap');
}

function handleContactForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Mô phỏng gửi dữ liệu liên hệ
    console.log("Đang xử lý form liên hệ:", { name, email, subject, message });
    
    // Mô phỏng gửi thành công
    alert("Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.");
    document.getElementById('contact-form').reset();
}

function showMovieDetails(movieId) {
    // Trong thực tế, bạn sẽ tạo một route riêng cho chi tiết phim
    alert(`Đang hiển thị chi tiết phim có ID: ${movieId}`);
    // router.navigate('chitietphim/' + movieId);
}