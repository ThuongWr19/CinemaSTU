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
