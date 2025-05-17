package com.CinemaGO.backend.controller;

import com.CinemaGO.backend.entities.Showtime;
import com.CinemaGO.backend.repositories.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@PreAuthorize("isAuthenticated()")
public class ShowtimeController {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @GetMapping("/by-movie/{movieId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Showtime>> getShowtimesByMovie(@PathVariable Long movieId) {
        List<Showtime> showtimes = showtimeRepository.findByMovieId(movieId);
        return ResponseEntity.ok(showtimes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Showtime> getShowtimeById(@PathVariable Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Suất chiếu không tồn tại"));
        return ResponseEntity.ok(showtime);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
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
        int seatsPerRow = 20;

        for (char row : rows) {
            for (int i = 1; i <= seatsPerRow; i++) {
                sb.append(row).append(i).append(":available,");
            }
        }

        if (!sb.isEmpty()) {
            sb.setLength(sb.length() - 1);
        }

        return sb.toString();
    }


}
