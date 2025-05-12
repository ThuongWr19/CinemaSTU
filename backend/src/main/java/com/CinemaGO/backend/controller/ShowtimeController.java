package com.CinemaGO.backend.controller;

import com.CinemaGO.backend.entities.Showtime;
import com.CinemaGO.backend.repositories.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    // Lấy danh sách suất chiếu theo movieId
    @GetMapping("/by-movie/{movieId}")
    public List<Showtime> getShowtimesByMovie(@PathVariable Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    // (Tùy chọn) Lấy chi tiết suất chiếu
    @GetMapping("/{id}")
    public Showtime getShowtimeById(@PathVariable Long id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
    }

    @PostMapping
    public ResponseEntity<?> createShowtime(@RequestBody Showtime showtime) {
        if (showtime.getMovie() == null || showtime.getShowtime() == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin suất chiếu");
        }

        // Nếu chưa có seatMap → tự tạo
        if (showtime.getSeatMap() == null || showtime.getSeatMap().isBlank()) {
            showtime.setSeatMap(generateDefaultSeatMap());
        }

        if (showtime.getAvailableSeats() <= 0) {
            // mặc định bằng số ghế
            int seatCount = (int) showtime.getSeatMap().chars().filter(c -> c == ':').count();
            showtime.setAvailableSeats(seatCount);
        }

        Showtime saved = showtimeRepository.save(showtime);
        return ResponseEntity.ok(saved);
    }


    private String generateDefaultSeatMap() {
        StringBuilder sb = new StringBuilder();
        char[] rows = {'A', 'B', 'C', 'D'}; // 4 hàng
        int seatsPerRow = 10;

        for (char row : rows) {
            for (int i = 1; i <= seatsPerRow; i++) {
                sb.append(row).append(i).append(":available,");
            }
        }

        // Xoá dấu phẩy cuối
        if (sb.length() > 0) {
            sb.setLength(sb.length() - 1);
        }

        return sb.toString();
    }


}
