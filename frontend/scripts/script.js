document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateLoginState === 'function') {
        updateLoginState();
    }
});

function getMovieList() {
    const movies_list = document.getElementById("movies-list");
    if (!movies_list) {
        console.error("movies-list element not found");
        return;
    }

    // Use authFetch if available, otherwise use regular fetch
    const fetchFunction = window.authFetch || fetch;
    
    fetchFunction("http://localhost:8080/api/movies")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            movies_list.innerHTML = '';
            if (data.length > 0) {
                data.forEach((movie) => {
                    const modalId = `trailerModal-${movie.id}`;
                    const youtubeIframe = movie.trailer_url ? youtubeUrlToEmbed(movie.trailer_url, modalId) : null;
                    
                    const trailerButton = movie.trailer_url ? `
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">
                            Xem Trailer
                        </button>
                    ` : `<button type="button" class="btn btn-secondary disabled">Không có Trailer</button>`;

                    const trailerModal = movie.trailer_url ? `
                        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="${modalId}Label">Trailer: ${movie.title}</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body text-center">
                                        <div class="ratio ratio-16x9">
                                            ${youtubeIframe || '<p>Không thể tải trailer</p>'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : '';

                    const card = `
                    <div class="col">
                        <div class="card text-center h-100">
                            <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
                                <img src="${movie.poster_url}" class="img-thumbnail rounded-4" style="height: 500px;"
                                     onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'"/>
                                <a href="#!">
                                    <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
                                </a>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text">${movie.description || 'No description available'}</p>
                                <div class="d-flex justify-content-center gap-2">
                                    ${trailerButton}
                                    <a href="/datve?id=${movie.id}" class="btn btn-success">Đặt vé</a>
                                </div>
                            </div>
                        </div>
                        ${trailerModal}
                    </div>
                    `;
                    movies_list.innerHTML += card;
                });

                // Thêm sự kiện sau khi tất cả modal đã được tạo
                data.forEach((movie) => {
                    if (movie.trailer_url) {
                        const modalId = `trailerModal-${movie.id}`;
                        const modalElement = document.getElementById(modalId);
                        if (modalElement) {
                            modalElement.addEventListener('hidden.bs.modal', function() {
                                const iframe = this.querySelector('iframe');
                                if (iframe) {
                                    // Thay thế bằng URL rỗng để dừng video
                                    iframe.src = '';
                                }
                            });
                            modalElement.addEventListener('show.bs.modal', function() {
                                const iframe = this.querySelector('iframe');
                                if (iframe) {
                                    // Khôi phục URL khi modal được mở lại
                                    iframe.src = `https://www.youtube.com/embed/${getYouTubeId(movie.trailer_url)}?enablejsapi=1&autoplay=1`;
                                }
                            });
                        }
                    }
                });
            } else {
                movies_list.innerHTML = '<div class="col-12 text-center"><p>Không có phim nào</p></div>';
            }
        })
        .catch((error) => {
            console.error("Error fetching movie list:", error);
            movies_list.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-danger" role="alert">
                        Không thể tải danh sách phim. Vui lòng thử lại sau.
                    </div>
                </div>
            `;
        });
}

// Hàm lấy ID từ URL YouTube
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Hàm tạo iframe với ID player riêng
function youtubeUrlToEmbed(url, modalId) {
    const videoId = getYouTubeId(url);
    if (videoId) {
        return `<iframe id="yt-${modalId}" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    return null;
}