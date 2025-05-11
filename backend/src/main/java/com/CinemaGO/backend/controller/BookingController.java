package com.CinemaGO.backend.controller;

import com.CinemaGO.backend.entities.Booking;
import com.CinemaGO.backend.entities.Movie;
import com.CinemaGO.backend.entities.Showtime;
import com.CinemaGO.backend.repositories.BookingRepository;
import com.CinemaGO.backend.repositories.MovieRepository;
import com.CinemaGO.backend.repositories.ShowtimeRepository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest) {
        // Tìm phim theo ID
        Optional<Movie> movieOptional = movieRepository.findById(bookingRequest.getMovieId());
        if (movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Movie not found");
        }

        // Tìm suất chiếu theo ID
        Optional<Showtime> showtimeOptional = showtimeRepository.findById(bookingRequest.getShowtimeId());
        if (showtimeOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Showtime not found");
        }

        Showtime showtime = showtimeOptional.get();

        // Kiểm tra số ghế trống
        if (showtime.getAvailableSeats() < bookingRequest.getQuantity()) {
            return ResponseEntity.badRequest().body("Not enough seats available");
        }

        // Cập nhật số lượng ghế trống
        showtime.setAvailableSeats(showtime.getAvailableSeats() - bookingRequest.getQuantity());
        showtimeRepository.save(showtime);

        // Tạo booking
        Booking booking = new Booking();
        booking.setMovie(movieOptional.get());
        booking.setShowtime(showtime);
        booking.setQuantity(bookingRequest.getQuantity());
        booking.setBookingCode("BK" + System.currentTimeMillis()); // Tạo mã booking độc nhất

        bookingRepository.save(booking);

        return ResponseEntity.ok(booking);
    }

    // DTO cho Booking Request
    @Setter
    @Getter
    static class BookingRequest {
        private Long movieId;
        private Long showtimeId;
        private int quantity;

    }
}