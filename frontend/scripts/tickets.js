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
           <div class="col card mb-3 mx-4 ticket-item" data-id="${booking.id}" style="opacity: 0; animation: fadeIn 0.3s ease-in forwards; animation-delay: ${index * 0.1}s;">
                <div class="card-body">
                    <h5 class="card-title">Mã vé: ${booking.bookingCode}</h5>
                    <p class="card-text text-start">
                        <strong>Phim:</strong> ${booking.movie.title}<br>
                        <strong>Phòng chiếu:</strong> ${booking.showtime.theaterName}<br>
                        <strong>Thời gian:</strong> ${new Date(booking.showtime.showtime).toLocaleString()}<br>
                        <strong>Số lượng vé:</strong> ${booking.quantity}
                    </p>
                    <button class="btn btn-danger btn-sm delete-btn">Xoá vé</button>
                </div>
            </div>
        `).join('') : `<p class="text-white">Không có vé nào.</p>`;

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const ticketCard = e.target.closest(".card");
                const bookingId = ticketCard.getAttribute("data-id");

                showConfirmModal({
                    message: "Bạn có chắc muốn xóa vé này?",
                    onConfirm: async () => {
                        try {
                            const response = await authFetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                                method: "DELETE"
                            });

                            if (!response.ok) {
                                const errorText = await response.text(); // Lấy text thay vì json
                                const errorData = errorText ? JSON.parse(errorText) : { error: "Không thể xóa vé." };
                                throw new Error(errorData.error || "Không thể xóa vé.");
                            }

                            ticketCard.remove();
                            showModal({
                                title: "Thành công",
                                message: "Vé đã được xóa.",
                                type: "success",
                                autoClose: true
                            });
                        } catch (error) {
                            showModal({
                                title: "Lỗi",
                                message: error.message === "Unauthorized" ? "Vui lòng đăng nhập lại." : (error.message || "Không thể xóa vé."),
                                type: "error"
                            });
                            console.error(error);
                        }
                    }
                });
            });
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Không thể tải danh sách vé.</div>`;
    }
}

window.addEventListener("DOMContentLoaded", loadUserTickets);