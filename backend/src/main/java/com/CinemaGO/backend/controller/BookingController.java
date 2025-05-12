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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
    public ResponseEntity<?> bookTickets(@RequestBody BookingRequest request) {
        Optional<Movie> optionalMovie = movieRepository.findById(request.getMovieId());
        Optional<Showtime> optionalShowtime = showtimeRepository.findById(request.getShowtimeId());

        if (optionalMovie.isEmpty() || optionalShowtime.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Phim hoặc suất chiếu không tồn tại."));
        }

        Showtime showtime = optionalShowtime.get();

        // Validate seatMap
        String seatMap = showtime.getSeatMap(); // ví dụ: "A1:available,A2:booked,B1:available"
        if (seatMap == null || seatMap.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không có sơ đồ ghế."));
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
                    alreadyBooked.add(code); // ghế đã được đặt trước đó
                } else {
                    updatedMap.add(code + ":booked");
                }
            } else {
                updatedMap.add(entry);
            }
        }

        if (!alreadyBooked.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Một số ghế đã được đặt: " + String.join(", ", alreadyBooked)
            ));
        }

        // Cập nhật lại seatMap trong showtime
        showtime.setSeatMap(String.join(",", updatedMap));
        showtime.setAvailableSeats(showtime.getAvailableSeats() - request.getSelectedSeats().size());
        showtimeRepository.save(showtime);

        // Tạo mã booking
        String bookingCode = "BK" + System.currentTimeMillis();



        Booking booking = new Booking();
        booking.setMovie(optionalMovie.get());
        booking.setShowtime(showtime);
        booking.setQuantity(request.getQuantity());
        booking.setBookingCode(bookingCode);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // lấy username từ token/session

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        booking.setUser(user); // ✅ liên kết với account_id

        bookingRepository.save(booking);






        return ResponseEntity.ok(Map.of(
                "message", "Đặt vé thành công",
                "bookingCode", bookingCode
        ));


    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
        }

        String username = userDetails.getUsername();
        Optional<User> accountOpt = userRepository.findByUsername(username);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản không tồn tại");
        }

        List<Booking> bookings = bookingRepository.findByUser(accountOpt.get());

        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();

        List<BookingResponse> result = bookings.stream().map(b -> new BookingResponse(
                b.getBookingCode(),
                b.getUser().getUsername(),
                b.getMovie().getTitle(),
                b.getShowtime().getTheaterName(),
                b.getShowtime().getShowtime().toString(),
                b.getQuantity()
        )).toList();

        return ResponseEntity.ok(result);
    }


}