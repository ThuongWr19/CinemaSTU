function createMovieCard(movie, size = 'md') {
    const modalId = `trailerModal-${movie.id}`;
    const youtubeIframe = movie.trailer_url ? youtubeUrlToEmbed(movie.trailer_url, modalId) : null;

    const trailerButton = movie.trailer_url 
        ? `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">Xem Trailer</button>`
        : `<button type="button" class="btn btn-secondary disabled">Không có Trailer</button>`;

    const trailerModal = movie.trailer_url ? `
        <div class="modal fade trailer-modal" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-${size}">
                <div class="modal-content modal-content-trailer">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">Trailer: ${movie.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center position-relative">
                        <div class="trailer-container">
                            ${youtubeIframe || '<p>Không thể tải trailer</p>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .trailer-modal {
                display: flex !important;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                z-index: 1050;
            }
            .trailer-modal .modal-dialog {
                margin: auto;
                width: 80vw;
                max-width: 854px;
                height: auto;
                max-height: 90vh;
            }
            .trailer-modal .modal-content {
                width: 100%;
                height: 100%;
            }
            .trailer-modal .modal-backdrop {
                z-index: 1040;
            }
            .trailer-modal.fade:not(.show) {
                display: none !important;
            }
            .trailer-container {
                position: relative;
                width: 100%;
                padding-bottom: 56.25%;
                height: 0;
                overflow: hidden;
            }
            .trailer-container iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        </style>
    ` : '';

    if (trailerModal) {
        document.body.insertAdjacentHTML('beforeend', trailerModal);

        const modal = document.getElementById(modalId);
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        }, { once: true });
    }

    return `
        <div class="col movie-card" style="opacity: 0; animation: fadeIn 0.3s ease-in forwards; animation-delay: ${movie.id * 0.1}s;">
            <div class="card text-center h-100">
                <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
                    <img src="${movie.poster_url}" class="img-thumbnail rounded-4" style="height: 500px;"
                         onerror="this.src='/CinemaGo/frontend/assets/favicon-32x32.png'"/>
                    <a href="#"><div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div></a>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.description || 'No description available'}</p>
                    <div class="d-flex justify-content-center gap-2">
                        ${trailerButton}
                        <a href="${BASE_PATH}/datve?id=${movie.id}" class="btn btn-success">Đặt vé</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function getMovieList() {
    const moviesList = document.getElementById("movies-list");
    if (!moviesList) {
        console.error("movies-list element not found in the DOM.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/movies");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        moviesList.innerHTML = data.length > 0 
            ? data.map(movie => createMovieCard(movie, 'md')).join('')
            : '<p class="text-center">Không có phim nào để hiển thị.</p>';
    } catch (error) {
        console.error("Error fetching movies:", error);
        showModal({
            title: 'Lỗi',
            message: `Không thể tải danh sách phim: ${error.message}`,
            type: 'error'
        });
    }
}

function youtubeUrlToEmbed(url, modalId) {
    try {
        const urlObj = new URL(url);
        let videoId;

        if (urlObj.hostname === "youtu.be") {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes("youtube.com")) {
            videoId = urlObj.searchParams.get("v") || urlObj.pathname.split("/embed/")[1];
        }

        if (!videoId) throw new Error("Invalid YouTube URL");

        console.log(`Video ID extracted: ${videoId}`);

        const iframe = `<iframe id="${modalId}-iframe" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0" allowfullscreen></iframe>`;
        
        document.addEventListener('shown.bs.modal', function handler(e) {
            if (e.target.id !== modalId) return;
            const modal = document.getElementById(modalId);
            modal.addEventListener('hidden.bs.modal', () => {
                const iframe = document.getElementById(`${modalId}-iframe`);
                if (iframe) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    iframe.src = iframe.src;
                }
            }, { once: true });
            document.removeEventListener('shown.bs.modal', handler);
        }, { once: true });

        return iframe;
    } catch (error) {
        console.error("Error converting YouTube URL:", error);
        return '<p>Không thể tải trailer</p>';
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

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('movies-list')) {
        getMovieList();
    }
});