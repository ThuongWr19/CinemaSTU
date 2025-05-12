
document.addEventListener('DOMContentLoaded', () => {
    const moviesList = document.getElementById("movies-list");
    if (!moviesList) {
        console.error("movies-list không tồn tại trong DOM.");
    }
});

async function getMovieList() {
    const moviesList = document.getElementById("movies-list");
    if (!moviesList) {
        console.error("movies-list element not found in the DOM.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/movies");
        if (!response.ok) {
            throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        moviesList.innerHTML = '';

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
                                 onerror="this.src='/CinemaGo/frontend/assets/frontend/assets/favicon-32x32.png"/>
                            <a href="#">
                                <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
                            </a>
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
                    ${trailerModal}
                </div>
                `;
                moviesList.innerHTML += card;
            });
        } else {
            moviesList.innerHTML = '<p class="text-center">Không có phim nào để hiển thị.</p>';
        }
    } catch (error) {
        console.error("Error fetching or displaying movies:", error);
        alert("Đã xảy ra lỗi khi tải danh sách phim. Vui lòng thử lại sau.");
    }
}

function youtubeUrlToEmbed(url, modalId) {
    try {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get("v");
        if (!videoId) {
            throw new Error("Invalid YouTube URL");
        }
        return `<iframe id="${modalId}-iframe" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    } catch (error) {
        console.error("Error converting YouTube URL:", error);
        return null;
    }
}