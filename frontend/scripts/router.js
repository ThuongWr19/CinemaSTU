window.BASE_PATH = '/CinemaGo';

const routes = {
    '/': '/frontend/template/home.html',
    '/home': '/frontend/template/home.html',
    '/dangnhap': '/frontend/template/login.html',
    '/dangky': '/frontend/template/register.html',
    '/404': '/frontend/template/404.html',
    '/danhsachphim': '/frontend/template/movies-list.html',
    '/datve': '/frontend/template/booking.html',
    '/khuyenmai': '/frontend/template/404.html',
    '/lienhe': '/frontend/template/contact.html',
    '/chinhsach': '/frontend/template/policy.html',
    '/faq': '/frontend/template/faq.html',
    '/admin/dashboard': '/frontend/template/admin.html',
    '/tickets': '/frontend/template/tickets.html',
};

const appContainer = document.getElementById('app-container');

window.addEventListener('popstate', () => {
    loadContent(location.pathname.replace(BASE_PATH, '') + location.search);
});

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')?.startsWith(BASE_PATH)) {
        e.preventDefault();
        const path = link.getAttribute('href').replace(BASE_PATH, '');
        navigate(path);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadContent(location.pathname.replace(BASE_PATH, '') + location.search);
    initParallax();
});

function navigate(path) {
    history.pushState(null, '', BASE_PATH + path);
    loadContent(path);
}

async function loadContent(url) {
    const urlObj = new URL(url, window.location.origin);
    let pathname = urlObj.pathname.replace(BASE_PATH, '');
    const queryParams = urlObj.searchParams;

    try {
        const mappedRoute = routes[pathname] || routes['/404'];
        const response = await fetch(BASE_PATH + mappedRoute);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        appContainer.style.opacity = '0';
        appContainer.innerHTML = await response.text();
        appContainer.style.opacity = '1';

        if (pathname === '/' || pathname === '/home' || pathname === '/danhsachphim') getMovieList();
        else if (pathname === '/tickets') loadUserTickets();
        else if (pathname === '/admin/dashboard') loadAdminDashboard();
        else if (pathname === '/datve') {
            if (queryParams.get('id')) {
                loadMovieDetails(queryParams.get('id'));
            } else {
                showModal({
                    title: 'Cảnh báo',
                    message: 'Không tìm thấy ID phim trong URL.',
                    type: 'warning',
                    size: 'md'
                });
            }
        }

        executeScripts();
        updateLoginState();
        updateActiveNavLink(pathname);
    } catch (err) {
        console.error(err);
        appContainer.innerHTML = '<div class="alert alert-danger">Không thể tải trang.</div>';
    }
}

function renderTable({ title, headers, rows, actions }) {
    return `
        <h4>${title}</h4>
        <table class="table table-bordered">
            <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(row => `
                <tr>${row.cells.map(cell => `<td>${cell}</td>`).join('')}
                    ${actions ? `<td>${actions(row.id).join('')}</td>` : ''}
                </tr>`).join('')}
            </tbody>
        </table>
    `;
}

async function loadUserTickets() {
    const container = document.getElementById("tickets-list");
    if (!auth.isLoggedIn()) {
        container.innerHTML = `<div class="alert alert-warning">Bạn cần đăng nhập để xem vé.</div>`;
        return;
    }

    try {
        const response = await authFetch("http://localhost:8080/api/bookings/me");
        if (!response.ok) throw new Error("Lỗi khi tải danh sách vé");

        const data = await response.json();
        container.innerHTML = data.length ? data.map((booking, index) => `
            <div class="card mb-3" style="opacity: 0; animation: fadeIn 0.3s ease-in forwards; animation-delay: ${index * 0.1}s;">
                <div class="card-body">
                    <h5 class="card-title">Mã vé: ${booking.bookingCode}</h5>
                    <p class="card-text">
                        <strong>Phim:</strong> ${booking.movie.title}<br>
                        <strong>Phòng chiếu:</strong> ${booking.showtime.theaterName}<br>
                        <strong>Thời gian:</strong> ${new Date(booking.showtime.showtime).toLocaleString()}<br>
                        <strong>Số lượng vé:</strong> ${booking.quantity}
                    </p>
                </div>
            </div>
        `).join('') : `<p>Không có vé nào.</p>`;
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Không thể tải danh sách vé.</div>`;
    }
}

async function loadAdminMovies(container) {
    const data = await (await fetch("http://localhost:8080/api/movies")).json();
    container.innerHTML = `
        <h3 class="mb-3">🎬 Danh sách phim</h3>
        <button class="btn btn-primary mb-3" id="add-movie">➕ Thêm phim</button>
        ${renderTable({
            title: '',
            headers: ['Tên phim', 'Ngày công chiếu', 'Trạng thái', ''],
            rows: data.map(m => ({
                id: m.id,
                cells: [m.title, new Date(m.release_date).toLocaleDateString(), m.status]
            })),
            actions: id => [
                `<button class="btn btn-warning btn-sm" data-action="edit" data-id="${id}">Sửa</button>`,
                `<button class="btn btn-danger btn-sm" data-action="delete" data-id="${id}">Xóa</button>`
            ]
        })}
    `;

    container.querySelector("#add-movie").onclick = () => showMovieForm(container);
    container.querySelectorAll("button[data-action='edit']").forEach(btn => {
        btn.onclick = () => showMovieForm(container, btn.dataset.id);
    });
    container.querySelectorAll("button[data-action='delete']").forEach(btn => {
        btn.onclick = () => {
            showConfirmModal({
                message: 'Xác nhận xóa phim?',
                onConfirm: async () => {
                    await authFetch(`http://localhost:8080/api/movies/${btn.dataset.id}`, { method: "DELETE" });
                    loadAdminMovies(container);
                },
                size: 'md'
            });
        };
    });
}

async function loadAdminBookings(container) {
    const data = await (await authFetch("http://localhost:8080/api/bookings/all")).json();
    container.innerHTML = renderTable({
        title: '🎟️ Danh sách vé đã đặt',
        headers: ['Mã vé', 'Người đặt', 'Phim', 'Rạp', 'Thời gian chiếu', 'Thời gian đặt vé', 'Số vé', ''],
        rows: data.map(b => ({
            id: b.id,
            cells: [
                b.bookingCode,
                b.username,
                b.movieTitle,
                b.theaterName,
                new Date(b.showtime).toLocaleString(),
                new Date(b.createdAt).toLocaleString(),
                b.quantity
            ]
        })),
        actions: id => [
            `<button class="btn btn-sm btn-warning" data-id="${id}" data-action="edit">Sửa</button>`,
            `<button class="btn btn-sm btn-danger" data-id="${id}" data-action="delete">Xóa</button>`
        ]
    });

    container.querySelectorAll("button[data-action='delete']").forEach(btn => {
        btn.onclick = () => {
            showConfirmModal({
                message: 'Xác nhận xóa vé?',
                onConfirm: async () => {
                    await authFetch(`http://localhost:8080/api/bookings/${btn.dataset.id}`, { method: "DELETE" });
                    loadAdminBookings(container);
                },
                size: 'md'
            });
        };
    });
    container.querySelectorAll("button[data-action='edit']").forEach(btn => {
        btn.onclick = () => showBookingForm(container, btn.dataset.id);
    });
}

async function loadAdminUsers(container) {
    const res = await authFetch("http://localhost:8080/api/users");
    if (!res.ok) {
        container.innerHTML = `<div class="alert alert-danger">Không thể tải danh sách người dùng.</div>`;
        return;
    }

    const users = await res.json();
    container.innerHTML = renderTable({
        title: '👤 Danh sách người dùng',
        headers: ['Username', 'Quyền', ''],
        rows: users.map(u => ({
            id: u.id,
            cells: [u.username, u.roles]
        })),
        actions: id => [
            `<button class="btn btn-sm btn-warning" data-id="${id}" data-action="edit">Sửa</button>`,
            `<button class="btn btn-sm btn-danger" data-id="${id}" data-action="delete">Xóa</button>`
        ]
    });

    container.querySelectorAll("button[data-action='edit']").forEach(btn => {
        btn.onclick = () => editUser(btn.dataset.id);
    });
    container.querySelectorAll("button[data-action='delete']").forEach(btn => {
        btn.onclick = () => {
            showConfirmModal({
                message: 'Bạn có chắc muốn xóa người dùng này?',
                onConfirm: async () => {
                    const res = await authFetch(`http://localhost:8080/api/users/${btn.dataset.id}`, { method: "DELETE" });
                    if (res.ok) {
                        showModal({
                            title: 'Thành công',
                            message: 'Đã xóa người dùng',
                            type: 'success',
                            autoClose: true,
                            size: 'md'
                        });
                        loadAdminUsers(container);
                    } else {
                        showModal({
                            title: 'Lỗi',
                            message: 'Xóa thất bại',
                            type: 'error',
                            size: 'md'
                        });
                    }
                },
                size: 'md'
            });
        };
    });
}

function loadAdminDashboard() {
    const tabContainer = document.getElementById("admin-tabs");
    const contentContainer = document.getElementById("admin-content");

    tabContainer.addEventListener("click", (e) => {
        const tabLink = e.target.closest(".nav-link");
        if (tabLink) {
            tabContainer.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
            tabLink.classList.add("active");
            const tab = tabLink.getAttribute("data-tab");
            ({ movies: loadAdminMovies, bookings: loadAdminBookings, users: loadAdminUsers })[tab](contentContainer);
        }
    });

    loadAdminMovies(contentContainer);
}

async function editUser(id) {
    const newUsername = prompt("Nhập username mới:");
    if (!newUsername) return;
    const newRole = prompt("Nhập quyền mới (USER hoặc ADMIN):")?.toUpperCase();
    if (!["USER", "ADMIN"].includes(newRole)) {
        showModal({
            title: 'Cảnh báo',
            message: 'Quyền không hợp lệ',
            type: 'warning',
            size: 'md'
        });
        return;
    }

    const res = await authFetch(`http://localhost:8080/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, role: newRole })
    });

    const container = document.getElementById("admin-users");
    if (res.ok) {
        showModal({
            title: 'Thành công',
            message: 'Cập nhật thành công!',
            type: 'success',
            autoClose: true,
            size: 'md'
        });
        container && loadAdminUsers(container);
    } else {
        showModal({
            title: 'Lỗi',
            message: 'Lỗi khi cập nhật người dùng',
            type: 'error',
            size: 'md'
        });
    }
}

async function loadMovieDetails(movieId) {
    try {
        const [movieRes, showtimeRes] = await Promise.all([
            fetch(`http://localhost:8080/api/movies/${movieId}`),
            authFetch(`http://localhost:8080/api/showtimes/by-movie/${movieId}`)
        ]);

        if (!movieRes.ok || !showtimeRes.ok) throw new Error("Không thể tải dữ liệu phim hoặc suất chiếu.");

        const movie = await movieRes.json();
        const showtimes = await showtimeRes.json();
        const movieDetails = document.getElementById('movie-details');

        movieDetails.innerHTML = `
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${movie.poster_url}" class="img-fluid rounded-start" alt="Poster phim">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">${movie.description}</p>
                            <form id="booking-form">
                                <div class="mb-3">
                                    <label for="showtime-select" class="form-label">Chọn suất chiếu</label>
                                    <select id="showtime-select" class="form-select" required>
                                        <option value="">-- Chọn suất chiếu --</option>
                                        ${showtimes.map(s => `
                                            <option value="${s.id}">
                                                ${s.theaterName} - ${new Date(s.showtime).toLocaleString()} (còn ${s.availableSeats} ghế)
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="ticket-count" class="form-label">Số lượng vé</label>
                                    <input type="number" class="form-control" id="ticket-count" min="1" value="1">
                                </div>
                                <button type="submit" class="btn btn-primary" id="booking-btn">Xác nhận đặt vé</button>
                            </form>
                            <div id="seat-container" class="mt-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        attachBookingFormHandler(movieId);
    } catch (err) {
        console.error(err);
        showModal({
            title: 'Lỗi',
            message: 'Không thể tải thông tin phim hoặc suất chiếu.',
            type: 'error',
            size: 'md'
        });
    }
}

function attachBookingFormHandler(movieId) {
    const bookingForm = document.getElementById('booking-form');
    const showtimeSelect = document.getElementById("showtime-select");
    const seatContainer = document.getElementById("seat-container");
    const bookingBtn = document.getElementById('booking-btn');
    let selectedSeats = [];

    if (!bookingForm || !showtimeSelect) return;

    showtimeSelect.addEventListener("change", async () => {
        const showtimeId = showtimeSelect.value;
        if (!showtimeId) {
            seatContainer.innerHTML = "";
            return;
        }

        const showtime = await (await authFetch(`http://localhost:8080/api/showtimes/${showtimeId}`)).json();
        const seatMap = showtime.seatMap?.split(",") || [];

        seatContainer.innerHTML = `
            <h5>Chọn ghế:</h5>
            <div class="d-flex flex-wrap">${seatMap.map(entry => {
                const [code, status] = entry.split(":");
                const disabled = status !== "available" ? "disabled btn-secondary" : "btn-outline-success";
                return `<button class="seat btn ${disabled} m-1" data-seat="${code}" ${status !== "available" ? "disabled" : ""}>${code}</button>`;
            }).join('')}</div>
        `;

        selectedSeats = [];
        seatContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("seat") && !e.target.disabled) {
            const seat = e.target.dataset.seat;
            if (selectedSeats.includes(seat)) {
                selectedSeats = selectedSeats.filter(s => s !== seat);
                e.target.classList.remove("btn-success");
                e.target.classList.add("btn-outline-success");
            } else {
                selectedSeats.push(seat);
                e.target.classList.remove("btn-outline-success");
                e.target.classList.add("btn-success");
            }
        }
    });


        document.getElementById('ticket-count').addEventListener("change", () => {
            selectedSeats = [];
            seatContainer.querySelectorAll(".seat.btn-success").forEach(btn => {
                btn.classList.replace("btn-success", "btn-outline-success");
            });
        }, { once: true });
    });

    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        bookingBtn.classList.add('loading');
        bookingBtn.disabled = true;
        if (!auth.isLoggedIn()) {
            showModal({
                title: 'Cảnh báo',
                message: 'Bạn cần đăng nhập để đặt vé!',
                type: 'warning',
                size: 'md'
            });
            window.router.navigate("/dangnhap");
            bookingBtn.classList.remove('loading');
            bookingBtn.disabled = false;
            return;
        }

        const ticketCount = parseInt(document.getElementById('ticket-count').value, 10);
        const showtimeId = showtimeSelect.value;

        if (!showtimeId || selectedSeats.length !== ticketCount) {
            showModal({
                title: 'Cảnh báo',
                message: 'Vui lòng chọn đúng số ghế theo số lượng vé.',
                type: 'warning',
                size: 'md'
            });
            bookingBtn.classList.remove('loading');
            bookingBtn.disabled = false;
            return;
        }

        try {
            const response = await authFetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    movieId: parseInt(movieId),
                    showtimeId: parseInt(showtimeId),
                    quantity: ticketCount,
                    selectedSeats
                })
            });

            if (!response.ok) throw new Error(await response.text() || "Đặt vé thất bại.");

            showModal({
                title: 'Thành công',
                message: 'Đặt vé thành công!',
                type: 'success',
                autoClose: true,
                size: 'md'
            });
            window.router.navigate("/tickets");
        } catch (error) {
            console.error("Lỗi đặt vé:", error);
            showModal({
                title: 'Lỗi',
                message: `Không thể đặt vé: ${error.message}`,
                type: 'error',
                size: 'md'
            });
        } finally {
            bookingBtn.classList.remove('loading');
            bookingBtn.disabled = false;
        }
    });
}

function updateActiveNavLink(pathname) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href')?.replace(BASE_PATH, '') === pathname);
    });
}

function executeScripts() {
    appContainer.querySelectorAll('script:not([src])').forEach(oldScript => {
        const newScript = document.createElement('script');
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

function showBookingForm(container, bookingId) {
    fetch(`http://localhost:8080/api/bookings/${bookingId}`)
        .then(res => {
            if (!res.ok) throw new Error("Không thể tải thông tin vé");
            return res.json();
        })
        .then(b => {
            container.innerHTML = `
                <h4>✏️ Sửa vé</h4>
                <form id="edit-booking-form">
                    <label>Mã vé:</label>
                    <input class="form-control mb-2" value="${b.bookingCode}" disabled>
                    <label>Tên phim:</label>
                    <input class="form-control mb-2" name="movieTitle" value="${b.movieTitle}" required>
                    <label>Rạp chiếu:</label>
                    <input class="form-control mb-2" name="theaterName" value="${b.theaterName}" required>
                    <label>Thời gian chiếu:</label>
                    <input class="form-control mb-2" name="showtime" type="datetime-local" value="${b.showtime.replace(' ', 'T')}" required>
                    <label>Số lượng vé:</label>
                    <input class="form-control mb-2" name="quantity" type="number" value="${b.quantity}" min="1">
                    <button class="btn btn-success" id="edit-booking-btn">Lưu</button>
                </form>
            `;

            document.getElementById("edit-booking-form").onsubmit = async (e) => {
                e.preventDefault();
                const editBtn = document.getElementById('edit-booking-btn');
                editBtn.classList.add('loading');
                editBtn.disabled = true;
                const form = e.target;
                await authFetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: parseInt(form.quantity.value, 10) })
                });
                loadAdminBookings(container);
                editBtn.classList.remove('loading');
                editBtn.disabled = false;
            };
        })
        .catch(err => {
            showModal({
                title: 'Lỗi',
                message: `Lỗi: ${err.message}`,
                type: 'error',
                size: 'md'
            });
        });
}

function showMovieForm(container, movieId = null) {
    const movie = { title: "", description: "", release_date: "", poster_url: "", trailer_url: "", status: "COMING_SOON" };
    const fetchMovie = movieId ? fetch(`http://localhost:8080/api/movies/${movieId}`).then(res => res.json()) : Promise.resolve(movie);

    fetchMovie.then(data => {
        Object.assign(movie, data);
        container.innerHTML = `
            <h4>${movieId ? "✏️ Sửa" : "➕ Thêm"} phim</h4>
            <form id="movie-form">
                <input class="form-control mb-2" placeholder="Tên phim" name="title" value="${movie.title}" required>
                <input class="form-control mb-2" placeholder="Ngày công chiếu" name="release_date" type="date" value="${movie.release_date?.split('T')[0] || ''}" required>
                <select class="form-control mb-2" name="status">
                    <option value="COMING_SOON" ${movie.status === "COMING_SOON" ? "selected" : ""}>COMING_SOON</option>
                    <option value="NOW_SHOWING" ${movie.status === "NOW_SHOWING" ? "selected" : ""}>NOW_SHOWING</option>
                    <option value="STOPPED" ${movie.status === "STOPPED" ? "selected" : ""}>STOPPED</option>
                </select>
                <input class="form-control mb-2" placeholder="Poster URL" name="poster_url" value="${movie.poster_url}">
                <input class="form-control mb-2" placeholder="Trailer URL" name="trailer_url" value="${movie.trailer_url}">
                <textarea class="form-control mb-2" placeholder="Mô tả" name="description">${movie.description}</textarea>
                <button class="btn btn-success" id="movie-form-btn">${movieId ? "Cập nhật" : "Thêm"}</button>
            </form>
        `;

        document.getElementById("movie-form").onsubmit = async (e) => {
            e.preventDefault();
            const movieBtn = document.getElementById('movie-form-btn');
            movieBtn.classList.add('loading');
            movieBtn.disabled = true;
            const form = e.target;
            const body = {
                title: form.title.value,
                description: form.description.value,
                release_date: form.release_date.value,
                status: form.status.value,
                poster_url: form.poster_url.value,
                trailer_url: form.trailer_url.value
            };

            await authFetch(`http://localhost:8080/api/movies${movieId ? `/${movieId}` : ''}`, {
                method: movieId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            loadAdminMovies(container);
            movieBtn.classList.remove('loading');
            movieBtn.disabled = false;
        };
    });
}

function initParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    if (!parallaxSections.length) return;

    const updateParallax = () => {
        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const scrollY = window.scrollY;
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.style.backgroundPositionY = `${scrollY * 0.3}px`;
            }
        });
        requestAnimationFrame(updateParallax);
    };
    requestAnimationFrame(updateParallax);
}

window.router = { navigate };