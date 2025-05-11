// Initialize auth state
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
                                    ${movie.trailer_url ?
                                      `<a href="${movie.trailer_url}" target="_blank" class="btn btn-primary">Xem Trailer</a>` :
                                      `<button type="button" class="btn btn-secondary disabled">Không có Trailer</button>`}
                                    <a href="/datve?id=${movie.id}" class="btn btn-success">Đặt vé</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    movies_list.innerHTML += card;
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

// Function to create movie entity for testing
async function createSampleMovie() {
    // Only if authenticated and has admin role
    if (window.auth && window.auth.isLoggedIn()) {
        try {
            const response = await window.authFetch("http://localhost:8080/api/movies", {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Phim Mẫu',
                    description: 'Phim mẫu để kiểm tra chức năng',
                    poster_url: 'https://via.placeholder.com/300x450',
                    trailer_url: 'https://www.youtube.com/watch?v=sample',
                    release_date: '2025-05-15',
                    duration: 120,
                    category: 'Hành động'
                })
            });
            if (response.ok) {
                alert('Tạo phim mẫu thành công!');
                getMovieList();
            } else {
                alert('Không thể tạo phim mẫu');
            }
        } catch (error) {
            console.error('Error creating sample movie:', error);
        }
    } else {
        alert('Bạn cần đăng nhập với quyền quản trị để sử dụng chức năng này');
    }
}