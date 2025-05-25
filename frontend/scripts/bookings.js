
async function loadMovieBooking(movieId) {
    try {
        const [movieRes, showtimeRes] = await Promise.all([
            fetch(`http://localhost:8080/api/movies/${movieId}`),
            authFetch(`http://localhost:8080/api/showtimes/by-movie/${movieId}`)
        ]);

        if (!movieRes.ok || !showtimeRes.ok) throw new Error("Không thể tải dữ liệu phim hoặc suất chiếu.");

        const movie = await movieRes.json();
        const showtimes = await showtimeRes.json();
        const movieDetails = document.getElementById('movie-bookings');
        if (!movieDetails) {
            console.error("Phần tử 'movie-bookings' không tồn tại trong DOM.");
            return;
        }
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

async function showBookingForm(container, bookingId) {
    try {
        const bookingRes = await authFetch(`http://localhost:8080/api/bookings/${bookingId}`);
        if (!bookingRes.ok) throw new Error("Không thể tải thông tin vé");
        const booking = await bookingRes.json();

        const showtimeRes = await authFetch(`http://localhost:8080/api/showtimes/by-movie/${booking.movieId}`);
        if (!showtimeRes.ok) throw new Error("Không thể tải danh sách suất chiếu");
        const showtimes = await showtimeRes.json();

        if (showtimes.length === 0) {
            container.innerHTML = `<div class="alert alert-warning">Không có suất chiếu nào cho phim này.</div>`;
            return;
        }

        container.innerHTML = `
            <h4>✏️ Sửa vé</h4>
            <form id="edit-booking-form">
                <label>Mã vé:</label>
                <input class="form-control mb-2" value="${booking.bookingCode}" disabled>
                <label>Tên phim:</label>
                <input class="form-control mb-2" name="movieTitle" value="${booking.movieTitle}" disabled>
                <label>Rạp chiếu:</label>
                <input class="form-control mb-2" name="theaterName" value="${booking.theaterName}" disabled>
                <label>Chọn suất chiếu:</label>
                <select class="form-control mb-2" name="showtimeId" id="showtime-select" required>
                    <option value="">-- Chọn suất chiếu --</option>
                    ${showtimes.map(s => `
                        <option value="${s.id}" ${s.id === booking.showtimeId ? "selected" : ""} ${s.availableSeats === 0 ? "disabled" : ""}>
                            ${s.theaterName} - ${new Date(s.showtime).toLocaleString()} (còn ${s.availableSeats} ghế)
                        </option>
                    `).join('')}
                </select>
                <label>Số lượng vé:</label>
                <input class="form-control mb-2" name="quantity" type="number" value="${booking.quantity}" min="1" required>
                <label>Chọn ghế:</label>
                <div id="seat-container" class="mt-2"></div>
                <button type="submit" class="btn btn-success" id="edit-booking-btn">Lưu</button>
            </form>
        `;

        const editForm = document.getElementById("edit-booking-form");
        const showtimeSelect = document.getElementById("showtime-select");
        const seatContainer = document.getElementById("seat-container");
        let selectedSeats = [];

        if (booking.selectedSeats) {
            try {
                const initialSeats = JSON.parse(booking.selectedSeats);
                if (Array.isArray(initialSeats)) {
                    selectedSeats = initialSeats;
                }
            } catch (e) {
                console.error("Lỗi khi parse selectedSeats:", e);
            }
        }

        const updateSeatMap = async () => {
            const showtimeId = showtimeSelect.value;
            if (!showtimeId) {
                seatContainer.innerHTML = "";
                selectedSeats = [];
                return;
            }

            const showtime = await (await authFetch(`http://localhost:8080/api/showtimes/${showtimeId}`)).json();
            const seatMap = showtime.seatMap?.split(",") || [];

            seatContainer.innerHTML = `
    <h5>Chọn ghế:</h5>
    <div class="d-flex flex-wrap">${seatMap.map(entry => {
                const [code, status] = entry.split(":");
                const isSelected = selectedSeats.includes(code);
                const isAvailable = status === "available" || (status === "booked" && isSelected);
                const buttonClass = isSelected ? "btn-success" : isAvailable ? "btn-outline-success" : "btn-secondary";
                const disabled = !isAvailable ? "disabled" : "";
                return `<button type="button" class="seat btn ${buttonClass} m-1" data-seat="${code}" ${disabled}>${code}</button>`;
            }).join('')}</div>
`;

            seatContainer.querySelectorAll(".seat").forEach(button => {
                button.addEventListener("click", (e) => {
                    const seat = e.target.dataset.seat;
                    const quantity = parseInt(editForm.quantity.value) || 0;
                    if (e.target.disabled) return;

                    if (isSelected(seat)) {
                        selectedSeats = selectedSeats.filter(s => s !== seat);
                        e.target.classList.remove("btn-success");
                        e.target.classList.add("btn-outline-success");
                    } else if (selectedSeats.length < quantity) {
                        selectedSeats.push(seat);
                        e.target.classList.remove("btn-outline-success");
                        e.target.classList.add("btn-success");
                    }
                    console.log("Selected seats:", selectedSeats);
                    updateSeatDisplay();
                });
            });

            updateSeatDisplay();
        };

        // Hàm kiểm tra ghế đã chọn
        function isSelected(seat) {
            return selectedSeats.includes(seat);
        }

        // Cập nhật giao diện ghế
        function updateSeatDisplay() {
            seatContainer.querySelectorAll(".seat").forEach(button => {
                const seat = button.dataset.seat;
                const isSel = isSelected(seat);
                button.classList.toggle("btn-success", isSel);
                button.classList.toggle("btn-outline-success", !isSel && !button.disabled);
            });
        }

        await updateSeatMap();
        showtimeSelect.addEventListener("change", async () => {
            selectedSeats = [];
            await updateSeatMap();
        });

        editForm.quantity.addEventListener("change", () => {
            const quantity = parseInt(editForm.quantity.value) || 0;
            if (selectedSeats.length > quantity) {
                selectedSeats = selectedSeats.slice(0, quantity); // Giới hạn số ghế
            }
            updateSeatMap();
        });

        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editBtn = document.getElementById('edit-booking-btn');
            if (editBtn.disabled) return;
            editBtn.classList.add('loading');
            editBtn.disabled = true;

            const quantity = parseInt(editForm.quantity.value) || 0;
            if (selectedSeats.length !== quantity) {
                showModal({
                    title: 'Lỗi',
                    message: `Số ghế được chọn (${selectedSeats.length}) phải bằng số lượng vé (${quantity}).`,
                    type: 'error',
                    size: 'md',
                    autoClose: false
                });
                editBtn.classList.remove('loading');
                editBtn.disabled = false;
                return; // Dừng lại, không chuyển hướng
            }

            try {
                const response = await authFetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        showtimeId: parseInt(editForm.showtimeId.value, 10),
                        quantity: quantity,
                        selectedSeats: selectedSeats
                    })
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Cập nhật vé thất bại");
                }
                loadAdminBookings(container); // Chỉ load lại khi thành công
                showModal({
                    title: 'Thành công',
                    message: 'Cập nhật vé thành công!',
                    type: 'success',
                    autoClose: true,
                    size: 'md'
                });
            } catch (err) {
                console.error("Lỗi cập nhật vé:", err);
                showModal({
                    title: 'Lỗi',
                    message: `Không thể cập nhật vé: ${err.message}`,
                    type: 'error',
                    size: 'md',
                    autoClose: false
                });
            } finally {
                editBtn.classList.remove('loading');
                editBtn.disabled = false;
            }
        }, { once: true });
    } catch (err) {
        showModal({
            title: 'Lỗi',
            message: `Lỗi: ${err.message}`,
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
