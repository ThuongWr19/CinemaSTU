// History-based router with base path support (e.g., /CinemaGo)
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
  "/admin/dashboard": "/frontend/template/admin.html",
  '/tickets': '/frontend/template/tickets.html',
};

const appContainer = document.getElementById('app-container');

window.addEventListener('popstate', () => {
  const path = location.pathname.replace(BASE_PATH, '') + location.search;
  loadContent(path);
});

// Initial load
const initialPath = location.pathname.replace(BASE_PATH, '') + location.search;
loadContent(initialPath);

function navigate(path) {
  const fullPath = BASE_PATH + path;
  history.pushState(null, '', fullPath);
  loadContent(path);
}

async function loadContent(url) {
  const urlObj = new URL(url, window.location.origin);
  let pathname = urlObj.pathname;
if (pathname.startsWith(BASE_PATH)) {
    pathname = pathname.slice(BASE_PATH.length); // Loại bỏ '/CinemaGo'
}

  // Chuẩn hóa để loại BASE_PATH ra (ví dụ /CinemaGo)
  if (pathname.startsWith(BASE_PATH)) {
    pathname = pathname.slice(BASE_PATH.length);
  }

  const queryParams = urlObj.searchParams;

  try {
    const mappedRoute = routes[pathname] || routes['/404'];
    const route = BASE_PATH + mappedRoute;
    const response = await fetch(route);
    if (!routes[pathname]) {
        console.warn("Không tìm thấy route:", pathname, " → chuyển sang 404");
    }
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const content = await response.text();
    appContainer.innerHTML = content;

    if (pathname === '/' || pathname === '/home') {
      getMovieList();
    }

    if (pathname === '/tickets') {
      loadUserTickets();
    }

    if (pathname === "/admin/dashboard") {
      loadAdminDashboard();
    }

    if (pathname === '/datve') {
      const movieId = queryParams.get('id');
      if (movieId) {
        loadMovieDetails(movieId);
      } else {
        alert("Không tìm thấy ID phim trong URL.");
      }
    }

    executeScripts();
    updateLoginState();
  } catch (err) {
    console.error(err);
    appContainer.innerHTML = '<div class="alert alert-danger">Không thể tải trang.</div>';
  }
}

async function loadUserTickets() {
  const container = document.getElementById("tickets-list");

  if (!auth.isLoggedIn()) {
    container.innerHTML = `<div class="alert alert-warning">Bạn cần đăng nhập để xem vé.</div>`;
    return;
  }

  try {
    const response = await authFetch("http://localhost:8080/api/bookings/me");

    if (!response.ok) {
      throw new Error("Lỗi khi tải danh sách vé");
    }

    const data = await response.json();

    if (data.length === 0) {
      container.innerHTML = `<p>Không có vé nào.</p>`;
      return;
    }

    container.innerHTML = data.map(booking => `
      <div class="card mb-3">
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
    `).join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="alert alert-danger">Không thể tải danh sách vé.</div>`;
  }
}


function loadAdminMovies(container) {
  fetch("http://localhost:8080/api/movies")
    .then(res => res.json())
    .then(data => {
      container.innerHTML = `
        <h3 class="mb-3">🎬 Danh sách phim</h3>
        <button class="btn btn-primary mb-3" id="add-movie">➕ Thêm phim</button>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Tên phim</th>
              <th>Ngày công chiếu</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${data.map(m => `
              <tr>
                <td>${m.title}</td>
                <td>${new Date(m.release_date).toLocaleDateString()}</td>
                <td>${m.status}</td>
                <td>
                  <button class="btn btn-warning btn-sm" data-action="edit" data-id="${m.id}">Sửa</button>
                  <button class="btn btn-danger btn-sm" data-action="delete" data-id="${m.id}">Xóa</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      container.querySelector("#add-movie").onclick = () => showMovieForm(container);
      container.querySelectorAll("button[data-action='edit']").forEach(btn => {
        btn.onclick = () => showMovieForm(container, btn.dataset.id);
      });
      container.querySelectorAll("button[data-action='delete']").forEach(btn => {
        btn.onclick = async () => {
          if (confirm("Xác nhận xóa phim?")) {
            await authFetch(`http://localhost:8080/api/movies/${btn.dataset.id}`, {
              method: "DELETE"
            });
            loadAdminMovies(container);
          }
        };
      });
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

          <button class="btn btn-success">Lưu</button>
        </form>
      `;

      document.getElementById("edit-booking-form").onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        await authFetch(`http://localhost:8080/api/bookings/${bookingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: parseInt(form.quantity.value, 10)
            // TODO: Thêm sửa movie/showtime nếu backend hỗ trợ
          })
        });

        loadAdminBookings(container);
      };
    })
    .catch(err => {
      alert("Lỗi: " + err.message);
    });
}


function showMovieForm(container, movieId = null) {
  let movie = { title: "", description: "", release_date: "", poster_url: "", trailer_url: "", status: "COMING_SOON" };

  if (movieId) {
    fetch(`http://localhost:8080/api/movies/${movieId}`)
      .then(res => res.json())
      .then(data => {
        movie = data;
        renderForm();
      });
  } else {
    renderForm();
  }

  function renderForm() {
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
        <button class="btn btn-success">${movieId ? "Cập nhật" : "Thêm"}</button>
      </form>
    `;

    document.getElementById("movie-form").onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const body = {
        title: form.title.value,
        description: form.description.value,
        release_date: form.release_date.value,
        status: form.status.value,
        poster_url: form.poster_url.value,
        trailer_url: form.trailer_url.value
      };

      const method = movieId ? "PUT" : "POST";
      const url = movieId ? `http://localhost:8080/api/movies/${movieId}` : `http://localhost:8080/api/movies`;

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      loadAdminMovies(container);
    };
  }
}


async function loadAdminBookings(container) {
  const res = await authFetch("http://localhost:8080/api/bookings/all");
  const data = await res.json();

  container.innerHTML = `
    <h4>🎟️ Danh sách vé đã đặt</h4>
    <table class="table table-bordered">
      <thead><tr>
        <th>Mã vé</th><th>Người đặt</th><th>Phim</th><th>Rạp</th><th>Thời gian chiếu</th><th>Thời gian đặt vé</th><th>Số vé</th>
      </tr></thead>
      <tbody>
        ${data.map(b => `
          <tr>
            <td>${b.bookingCode}</td>
            <td>${b.username}</td>
            <td>${b.movieTitle}</td>
            <td>${b.theaterName}</td>
            <td>${new Date(b.showtime).toLocaleString()}</td>
            <td>${new Date(b.createdAt).toLocaleString()}</td>
            <td>${b.quantity}</td>
            <td>
              <button class="btn btn-sm btn-warning" data-id="${b.id}" data-action="edit">Sửa</button>
              <button class="btn btn-sm btn-danger" data-id="${b.id}" data-action="delete">Xóa</button>
            </td>
          </tr>`).join("")}
      </tbody>
    </table>
  `;
        container.querySelectorAll("button[data-action='delete']").forEach(btn => {
        btn.onclick = async () => {
          if (confirm("Xác nhận xóa vé?")) {
            await authFetch(`http://localhost:8080/api/bookings/${btn.dataset.id}`, { method: "DELETE" });
            loadAdminBookings(container);
          }
        };
      });

      // Optional: sửa vé
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

  container.innerHTML = `
    <h4>👤 Danh sách người dùng</h4>
    <table class="table table-bordered">
      <thead>
        <tr><th>Username</th><th>Quyền</th><th>Hành động</th></tr>
      </thead>
      <tbody>
        ${users.map(u => `
          <tr>
            <td>${u.username}</td>
            <td>${u.roles}</td>
            <td>
              <button class="btn btn-sm btn-warning" data-id="${u.id}" data-action="edit">Sửa</button>
              <button class="btn btn-sm btn-danger" data-id="${u.id}" data-action="delete">Xóa</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function loadAdminDashboard() {
  const tabContainer = document.getElementById("admin-tabs");
  const contentContainer = document.getElementById("admin-content");

  tabContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      [...tabContainer.querySelectorAll(".nav-link")].forEach(el => el.classList.remove("active"));
      e.target.classList.add("active");
      const tab = e.target.getAttribute("data-tab");

      switch (tab) {
        case "movies": loadAdminMovies(contentContainer); break;
        case "bookings": loadAdminBookings(contentContainer); break;
        case "users": loadAdminUsers(contentContainer); break;
      }
    }
  });

  // Load mặc định
  loadAdminMovies(contentContainer);
}

async function deleteUser(id) {
  if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

  const res = await authFetch(`http://localhost:8080/api/users/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    alert("Đã xóa người dùng");

    const container = document.getElementById("admin-users");
    if (!container) {
      console.warn("Không tìm thấy phần tử #admin-users");
      return;
    }

    loadAdminUsers(container);
  } else {
    alert("Xóa thất bại");
  }
}



async function editUser(id) {
  if (!id) return alert("ID không hợp lệ");

  const newUsername = prompt("Nhập username mới:");
  if (!newUsername) return;

  const newRole = prompt("Nhập quyền mới (USER hoặc ADMIN):");
  if (!newRole || !["USER", "ADMIN"].includes(newRole.toUpperCase())) {
    return alert("Quyền không hợp lệ");
  }

  const res = await authFetch(`http://localhost:8080/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: newUsername,
      role: newRole.toUpperCase()
    })
  });

  if (res.ok) {
    alert("Cập nhật thành công!");

    const container = document.getElementById("admin-users");
    if (!container) {
      console.warn("Không tìm thấy phần tử #admin-users");
      return;
    }

    loadAdminUsers(container);
  } else {
    alert("Lỗi khi cập nhật người dùng");
  }
}


async function loadMovieDetails(movieId) {
    try {
        const [movieRes, showtimeRes] = await Promise.all([
            fetch(`http://localhost:8080/api/movies/${movieId}`),
            fetch(`http://localhost:8080/api/showtimes/by-movie/${movieId}`)
        ]);

        if (!movieRes.ok || !showtimeRes.ok) {
            throw new Error("Không thể tải dữ liệu phim hoặc suất chiếu.");
        }

        const movie = await movieRes.json();
        const showtimes = await showtimeRes.json();

        const movieDetails = document.getElementById('movie-details');

        const showtimeOptions = showtimes.map(showtime => `
            <option value="${showtime.id}">
                ${showtime.theaterName} - ${new Date(showtime.showtime).toLocaleString()} (còn ${showtime.availableSeats} ghế)
            </option>
        `).join("");

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
                                        ${showtimeOptions}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="ticket-count" class="form-label">Số lượng vé</label>
                                    <input type="number" class="form-control" id="ticket-count" min="1" value="1">
                                </div>
                                <button type="submit" class="btn btn-primary">Xác nhận đặt vé</button>
                            </form>
                            <div id="seat-container" class="mt-4">
                              <!-- ghế sẽ được hiển thị ở đây -->
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        attachBookingFormHandler(movieId);

    } catch (err) {
        console.error(err);
        alert("Không thể tải thông tin phim hoặc suất chiếu.");
    }
}

function attachBookingFormHandler(movieId) {
    const bookingForm = document.getElementById('booking-form');
    const showtimeSelect = document.getElementById("showtime-select");
    const seatContainer = document.getElementById("seat-container");

    let selectedSeats = [];

    if (!bookingForm || !showtimeSelect) return;

    // Load ghế khi chọn suất chiếu
    showtimeSelect.addEventListener("change", async () => {
        const showtimeId = showtimeSelect.value;
        if (!showtimeId) {
            seatContainer.innerHTML = "";
            return;
        }

        const res = await fetch(`http://localhost:8080/api/showtimes/${showtimeId}`);
        const showtime = await res.json();

        const seatMap = showtime.seatMap?.split(",") || [];

        const seatHTML = seatMap.map(entry => {
            const [code, status] = entry.split(":");
            const disabled = status !== "available" ? "disabled btn-secondary" : "btn-outline-success";
            return `<button class="seat btn ${disabled} m-1" data-seat="${code}" ${status !== "available" ? "disabled" : ""}>${code}</button>`;
        }).join("");

        seatContainer.innerHTML = `
            <h5>Chọn ghế:</h5>
            <div class="d-flex flex-wrap">${seatHTML}</div>
        `;

        selectedSeats = [];

        // Giới hạn số ghế theo số vé
        seatContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("seat") && !e.target.disabled) {
                const seat = e.target.dataset.seat;
                const ticketCount = parseInt(document.getElementById('ticket-count').value, 10);

                if (selectedSeats.includes(seat)) {
                    selectedSeats = selectedSeats.filter(s => s !== seat);
                    e.target.classList.remove("btn-success");
                    e.target.classList.add("btn-outline-success");
                } else {
                    if (selectedSeats.length >= ticketCount) {
                        alert(`⚠️ Bạn chỉ được chọn tối đa ${ticketCount} ghế.`);
                        return;
                    }
                    selectedSeats.push(seat);
                    e.target.classList.remove("btn-outline-success");
                    e.target.classList.add("btn-success");
                }
            }
        });

        document.getElementById('ticket-count').addEventListener("change", () => {
            selectedSeats = [];
            seatContainer.querySelectorAll(".seat.btn-success").forEach(btn => {
                btn.classList.remove("btn-success");
                btn.classList.add("btn-outline-success");
            });
        });
    });

    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!auth.isLoggedIn()) {
            alert("⚠️ Bạn cần đăng nhập để đặt vé!");
            window.router.navigate("/dangnhap");
            return;
        }

        const ticketCount = parseInt(document.getElementById('ticket-count').value, 10);
        const showtimeId = showtimeSelect.value;

        if (!showtimeId || selectedSeats.length !== ticketCount) {
            alert("❗ Vui lòng chọn đúng số ghế theo số lượng vé.");
            return;
        }

        try {
            const response = await authFetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    movieId: parseInt(movieId),
                    showtimeId: parseInt(showtimeId),
                    quantity: ticketCount,
                    selectedSeats: selectedSeats
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Đặt vé thất bại.");
            }

            alert("🎉 Đặt vé thành công!");
            window.router.navigate("/tickets");
        } catch (error) {
            console.error("Lỗi đặt vé:", error);
            alert("Không thể đặt vé: " + error.message);
        }
    });
}



function updateActiveNavLink(pathname) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const relativeHref = href.replace(BASE_PATH, '');
    link.classList.toggle('active', relativeHref === pathname);
  });
}

function executeScripts() {
  const scripts = appContainer.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = oldScript.textContent;

    if (!newScript.src) {
      oldScript.parentNode.replaceChild(newScript, oldScript);
    }
  });
}

document.addEventListener('click', function (e) {
  const link = e.target.closest('a');
  if (link && link.getAttribute('href')?.startsWith(BASE_PATH)) {
    e.preventDefault();
    const path = link.getAttribute('href').replace(BASE_PATH, '');
    navigate(path);
  }
});

window.router = { navigate };