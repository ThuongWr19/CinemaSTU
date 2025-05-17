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
    try {
        const response = await authFetch('http://localhost:8080/api/bookings/all');
        if (!response.ok) throw new Error("Không thể tải danh sách vé");
        const bookings = await response.json();

        container.innerHTML = renderTable({
            title: "Danh sách vé",
            headers: ["ID", "Mã vé", "User", "Phim", "Suất chiếu", "Số lượng", "Thời gian đặt", "Hành động"],
            rows: bookings.map(b => ({
                cells: [b.id, b.bookingCode, b.username, b.movieTitle, b.theaterName + " - " + new Date(b.showtime).toLocaleString(), b.quantity, new Date(b.createdAt).toLocaleString()],
                id: b.id
            })),
            actions: (id) => [
                `<button class="btn btn-primary btn-sm edit-booking-btn" data-id="${id}">Sửa</button>`,
                `<button class="btn btn-danger btn-sm" onclick="showConfirmModal({ message: 'Bạn có chắc chắn muốn xóa vé ${id}?', onConfirm: () => deleteBooking(${id}) })">Xóa</button>`
            ]
        });

        // Gắn sự kiện click cho các nút "Sửa"
        container.querySelectorAll('.edit-booking-btn').forEach(button => {
            const bookingId = parseInt(button.dataset.id);
            button.addEventListener('click', () => {
                showBookingForm(container, bookingId);
            });
        });
    } catch (err) {
        showModal({
            title: 'Lỗi',
            message: `Không thể tải danh sách vé: ${err.message}`,
            type: 'error',
            size: 'md'
        });
    }
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

    // Check if elements exist
    if (!tabContainer || !contentContainer) {
        console.error("Admin dashboard elements not found: #admin-tabs or #admin-content");
        return;
    }

    tabContainer.addEventListener("click", (e) => {
        const tabLink = e.target.closest(".nav-link");
        if (tabLink) {
            e.preventDefault(); // Prevent default behavior of href="#"
            tabContainer.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
            tabLink.classList.add("active");
            const tab = tabLink.getAttribute("data-tab");
            const tabFunctions = {
                movies: loadAdminMovies,
                bookings: loadAdminBookings,
                users: loadAdminUsers
            };
            if (tabFunctions[tab]) {
                tabFunctions[tab](contentContainer);
            } else {
                console.error(`No handler for tab: ${tab}`);
            }
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