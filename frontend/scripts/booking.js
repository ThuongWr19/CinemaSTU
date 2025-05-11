// Lấy id từ URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (movieId) {
    // Gọi API để lấy thông tin phim theo id
    fetch(`http://localhost:8080/api/movies/${movieId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Không tìm thấy phim");
            }
            return response.json();
        })
        .then((movie) => {
            // Hiển thị thông tin phim trên giao diện
            document.getElementById("movie-title").textContent = movie.title;
            document.getElementById("movie-description").textContent = movie.description;
            document.getElementById("movie-poster").src = movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Image";
        })
        .catch((error) => {
            console.error("Lỗi khi lấy thông tin phim:", error);
            alert("Không tìm thấy phim.");
        });
} else {
    alert("Không tìm thấy ID phim trong URL.");
}