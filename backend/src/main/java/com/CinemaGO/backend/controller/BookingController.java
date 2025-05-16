package com.CinemaGO.backend.controller;

import com.CinemaGO.backend.dto.BookingRequest;
import com.CinemaGO.backend.dto.BookingResponse;
import com.CinemaGO.backend.entities.Booking;
import com.CinemaGO.backend.entities.Movie;
import com.CinemaGO.backend.entities.Showtime;
import com.CinemaGO.backend.entities.User;
import com.CinemaGO.backend.repositories.BookingRepository;
import com.CinemaGO.backend.repositories.MovieRepository;
import com.CinemaGO.backend.repositories.ShowtimeRepository;
import com.CinemaGO.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> bookTickets(@RequestBody BookingRequest request) {
        Optional<Movie> optionalMovie = movieRepository.findById(request.getMovieId());
        Optional<Showtime> optionalShowtime = showtimeRepository.findById(request.getShowtimeId());

        if (optionalMovie.isEmpty() || optionalShowtime.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phim hoặc suất chiếu không tồn tại."));
        }

        Showtime showtime = optionalShowtime.get();
        if (request.getSelectedSeats().size() != request.getQuantity()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Số ghế được chọn phải bằng số lượng vé."));
        }

        String seatMap = showtime.getSeatMap();
        if (seatMap == null || seatMap.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không có sơ đồ ghế."));
        }

        List<String> seatList = new ArrayList<>(Arrays.asList(seatMap.split(",")));
        Set<String> selectedSeats = new HashSet<>(request.getSelectedSeats());

        List<String> updatedMap = new ArrayList<>();
        Set<String> alreadyBooked = new HashSet<>();

        for (String entry : seatList) {
            String[] parts = entry.split(":");
            String code = parts[0];
            String status = parts.length > 1 ? parts[1] : "available";

            if (selectedSeats.contains(code)) {
                if ("booked".equalsIgnoreCase(status)) {
                    alreadyBooked.add(code);
                } else {
                    updatedMap.add(code + ":booked");
                }
            } else {
                updatedMap.add(entry);
            }
        }

        if (!alreadyBooked.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Một số ghế đã được đặt: " + String.join(", ", alreadyBooked)
            ));
        }

        showtime.setSeatMap(String.join(",", updatedMap));
        showtime.setAvailableSeats(showtime.getAvailableSeats() - request.getSelectedSeats().size());
        showtimeRepository.save(showtime);

        String bookingCode = "BK" + System.currentTimeMillis();
        Booking booking = new Booking();
        booking.setMovie(optionalMovie.get());
        booking.setShowtime(showtime);
        booking.setQuantity(request.getQuantity());
        booking.setBookingCode(bookingCode);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
        booking.setUser(user);

        bookingRepository.save(booking);

        return ResponseEntity.ok(Map.of(
                "message", "Đặt vé thành công",
                "bookingCode", bookingCode
        ));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyBookings() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        List<Booking> bookings = bookingRepository.findByUser(user);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        List<BookingResponse> result = bookings.stream().map(b -> new BookingResponse(
                b.getId(),
                b.getBookingCode(),
                b.getUser().getUsername(),
                b.getMovie().getTitle(),
                b.getShowtime().getTheaterName(),
                b.getShowtime().getShowtime().toString(),
                b.getQuantity(),
                b.getCreatedAt().toString()
        )).toList();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vé không tồn tại"));

        Showtime showtime = booking.getShowtime();
        String seatMap = showtime.getSeatMap();
        if (seatMap != null && !seatMap.isBlank()) {
            List<String> seatList = new ArrayList<>(Arrays.asList(seatMap.split(",")));
            List<String> updatedMap = seatList.stream()
                    .map(entry -> {
                        String[] parts = entry.split(":");
                        String code = parts[0];
                        return parts[1].equalsIgnoreCase("booked") ? code + ":available" : entry;
                    })
                    .collect(Collectors.toList());
            showtime.setSeatMap(String.join(",", updatedMap));
            showtime.setAvailableSeats(showtime.getAvailableSeats() + booking.getQuantity());
            showtimeRepository.save(showtime);
        }

        bookingRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa vé thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vé không tồn tại"));

        Optional<Showtime> optionalShowtime = showtimeRepository.findById(request.getShowtimeId());
        if (optionalShowtime.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Suất chiếu không tồn tại."));
        }

        if (request.getSelectedSeats().size() != request.getQuantity()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Số ghế được chọn phải bằng số lượng vé."));
        }

        // Release seats from old showtime
        Showtime oldShowtime = booking.getShowtime();
        String oldSeatMap = oldShowtime.getSeatMap();
        if (oldSeatMap != null && !oldSeatMap.isBlank()) {
            List<String> oldSeatList = new ArrayList<>(Arrays.asList(oldSeatMap.split(",")));
            List<String> updatedOldMap = oldSeatList.stream()
                    .map(entry -> {
                        String[] parts = entry.split(":");
                        String code = parts[0];
                        return parts[1].equalsIgnoreCase("booked") ? code + ":available" : entry;
                    })
                    .collect(Collectors.toList());
            oldShowtime.setSeatMap(String.join(",", updatedOldMap));
            oldShowtime.setAvailableSeats(oldShowtime.getAvailableSeats() + booking.getQuantity());
            showtimeRepository.save(oldShowtime);
        }

        Showtime newShowtime = optionalShowtime.get();
        String newSeatMap = newShowtime.getSeatMap();
        if (newSeatMap == null || newSeatMap.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không có sơ đồ ghế."));
        }

        List<String> newSeatList = new ArrayList<>(Arrays.asList(newSeatMap.split(",")));
        Set<String> selectedSeats = new HashSet<>(request.getSelectedSeats());
        List<String> updatedNewMap = new ArrayList<>();
        Set<String> alreadyBooked = new HashSet<>();

        for (String entry : newSeatList) {
            String[] parts = entry.split(":");
            String code = parts[0];
            String status = parts.length > 1 ? parts[1] : "available";

            if (selectedSeats.contains(code)) {
                if ("booked".equalsIgnoreCase(status)) {
                    alreadyBooked.add(code);
                } else {
                    updatedNewMap.add(code + ":booked");
                }
            } else {
                updatedNewMap.add(entry);
            }
        }

        if (!alreadyBooked.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Một số ghế đã được đặt: " + String.join(", ", alreadyBooked)
            ));
        }

        newShowtime.setSeatMap(String.join(",", updatedNewMap));
        newShowtime.setAvailableSeats(newShowtime.getAvailableSeats() - request.getSelectedSeats().size());
        showtimeRepository.save(newShowtime);

        booking.setShowtime(newShowtime);
        booking.setQuantity(request.getQuantity());
        bookingRepository.save(booking);

        return ResponseEntity.ok(Map.of("message", "Cập nhật vé thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vé không tồn tại"));

        BookingResponse response = new BookingResponse(
                b.getId(),
                b.getBookingCode(),
                b.getUser().getUsername(),
                b.getMovie().getTitle(),
                b.getShowtime().getTheaterName(),
                b.getShowtime().getShowtime().toString(),
                b.getQuantity(),
                b.getCreatedAt().toString()
        );

        return ResponseEntity.ok(response);
    }
}