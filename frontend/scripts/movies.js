function createMovieCard(movie, size = 'md') {
    return `
            <div class="col movie-card" style="opacity: 0; animation: fadeIn 0.3s ease-in forwards; animation-delay: ${movie.id * 0.1}s;">
            <a href="${BASE_PATH}/chitietphim?id=${movie.id}" class="text-decoration-none text-dark">
                <div class="card movie-hover-card position-relative overflow-hidden text-center h-100 w-auto">
                    <div class="movie-img-wrapper">
                        <img src="${movie.poster_url}" loading="lazy" class="movie-poster" onerror="this.src='/CinemaSTU/frontend/assets/favicon-32x32.png'" />
                        <div class="card-img-overlay movie-overlay d-flex flex-column justify-content-center align-items-start text-start fs-6 px-3">
                            <p class="card-text small movie-description text-white"><i class="bi bi-film text-warning fst-normal"> Đạo diễn:</i> ${movie.director}</p>
                            <p class="card-text small movie-description text-white"><i class="bi bi-people-fill text-warning fst-normal"> Diễn viên:</i> ${movie.actors}</p>
                            <p class="card-text small movie-description text-white"><i class="bi bi-star-fill text-warning fst-normal"> Đánh giá:</i> ${movie.rating}/10</p>
                            <p class="card-text small movie-description text-white"><i class="bi bi bi-clock text-warning fst-normal"> Thời lượng:</i> ${movie.duration} phút</p>
                            <br/>
                            <p class="card-text small movie-description text-white text-center"><i class="bi bi-info-circle-fill text-info fst-normal"> BẤM VÀO ĐỂ XEM CHI TIẾT</i></p>
                            
                        </div>
                    </div>
                    <div class="movie-title py-2 fw-bold fs-8 text-uppercase">${movie.title}</div>
                </div>
            </a>
        </div>
<<<<<<< HEAD
`;
=======
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
                         onerror="this.src='/CinemaSTU/frontend/assets/favicon-32x32.png'"/>
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
>>>>>>> 03ba8f5fedf36880930ec9f80751be02ad2c870e
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

        if (data.length === 0) {
            moviesList.innerHTML = '<p class="text-center">Không có phim nào để hiển thị.</p>';
            return;
        }

        const maxInitial = 6;
        const initialMovies = data.slice(0, maxInitial);
        const remainingMovies = data.slice(maxInitial);

        moviesList.innerHTML = initialMovies.map(movie => createMovieCard(movie, 'md')).join('');

        if (remainingMovies.length > 0) {
            const button = document.createElement("button");
            button.className = "btn btn-outline-primary mt-4 d-block mx-auto";
            button.innerText = "Xem thêm";
            button.addEventListener("click", () => {
                moviesList.insertAdjacentHTML("beforeend", remainingMovies.map(movie => createMovieCard(movie, 'md')).join(''));
                button.remove();
            });
            moviesList.parentElement.appendChild(button);
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        showModal({
            title: 'Lỗi',
            message: `Không thể tải danh sách phim: ${error.message}`,
            type: 'error'
        });
    }
}

async function getNowShowingMovies() {
    const nowShowingList = document.getElementById("now-showing-list");
    if (!nowShowingList) {
        console.error("now-showing-list element not found in the DOM.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/movies");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const nowShowingMovies = data.filter(movie => movie.status === 'NOW_SHOWING');

        if (nowShowingMovies.length === 0) {
            nowShowingList.innerHTML = '<p class="text-center">Không có phim đang chiếu để hiển thị.</p>';
            return;
        }

        nowShowingList.innerHTML = nowShowingMovies.map(movie => createMovieCard(movie, 'md')).join('');
    } catch (error) {
        console.error("Error fetching now showing movies:", error);
        showModal({
            title: 'Lỗi',
            message: `Không thể tải danh sách phim đang chiếu: ${error.message}`,
            type: 'error'
        });
    }
}

async function getComingSoonMovies() {
    const comingSoonList = document.getElementById("coming-soon-list");
    if (!comingSoonList) {
        console.error("coming-soon-list element not found in the DOM.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/movies");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const comingSoonMovies = data.filter(movie => movie.status === 'COMING_SOON');

        if (comingSoonMovies.length === 0) {
            comingSoonList.innerHTML = '<p class="text-center">Không có phim sắp chiếu để hiển thị.</p>';
            return;
        }

        comingSoonList.innerHTML = comingSoonMovies.map(movie => createMovieCard(movie, 'md')).join('');
    } catch (error) {
        console.error("Error fetching coming soon movies:", error);
        showModal({
            title: 'Lỗi',
            message: `Không thể tải danh sách phim sắp chiếu: ${error.message}`,
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

async function loadMovieDetails(movieId, size = 'md') {
    const getMovie = await fetch(`http://localhost:8080/api/movies/${movieId}`);
    const movie = await getMovie.json();
    if (!getMovie.ok) {
        throw new Error(`HTTP error! status: ${getMovie.status}`);
    }
    const modalId = `trailerModal-${movie.id}`;
    const movieDetails = document.getElementById('movie-details');

    const youtubeIframe = movie.trailer_url ? youtubeUrlToEmbed(movie.trailer_url, modalId) : null;
    const trailerButton = movie.trailer_url
        ? `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">Xem Trailer</button>`
        : `<button type="button" class="btn btn-secondary disabled">Không có Trailer</button>`;
    const date = new Date(movie.release_date);
    const formatted = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/');
    console.log(formatted); // 2025/01/28

    const bookingButton = movie.status === 'NOW_SHOWING' ?
        `<a href="${BASE_PATH}/datve?id=${movie.id}" class="btn btn-success">Đặt vé</a>` :
        `<p class="fw-bolder">Ra mắt: ${formatted}</p>`

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

    movieDetails.innerHTML = `
        <div class="card mb-3 text-start w-100" style="max-width: 100%; min-height: 100%;">
            <div class="row g-0 d-flex align-items-stretch h-100">
                <div class="col-md-4 m-auto">
                    <div class="image-container" style="position: relative; width: 100%; height: 100%; overflow: hidden;">
                        <img src="${movie.poster_url}" class="img-fluid rounded-start w-100 h-100" style="object-fit: contain; object-position: center; max-height: 550px;">
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card-body h-100 d-flex flex-column">
                        <h2 class="card-title fw-bolder text-uppercase text-warning">${movie.title}</h2>
                        <hr>
                        <p class="fw-bolder fs-5 mb-2">MÔ TẢ</p>
                        <p class="card-text mb-1"><b>Đạo diễn:</b> ${movie.director}</p>
                        <p class="card-text mb-1"><b>Diễn viên:</b> ${movie.actors}</p>
                        <p class="card-text mb-1"><b>Quốc gia:</b> ${movie.country}</p>
                        <p class="card-text mb-1"><b>Thời lượng:</b> ${movie.duration} phút</p>
                        <p class="card-text mb-1"><b>Điểm đánh giá:</b> ${movie.rating}/10 <i class="bi bi-star-fill text-warning"></i></p>
                        <hr>
                        <p class="fw-bold mb-2 fs-4">NỘI DUNG PHIM</p>
                        <p class="card-text mb-3">${movie.description}</p>
                        <hr>
                        <div class="d-flex justify-content-around gap-2 mt-auto">
                            ${trailerButton}
                            ${bookingButton}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('movies-list')) {
        getMovieList();
    }
<<<<<<< HEAD
    if (document.getElementById('now-showing-list')) {
        getNowShowingMovies();
    }
    if (document.getElementById('coming-soon-list')) {
        getComingSoonMovies();
    }
});
=======
});
>>>>>>> 03ba8f5fedf36880930ec9f80751be02ad2c870e
