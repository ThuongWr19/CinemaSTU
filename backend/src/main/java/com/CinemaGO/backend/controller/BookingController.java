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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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

    @Autowired
    private ObjectMapper objectMapper;

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
                if ("booked".equalsIgnoreCase(status))
                    alreadyBooked.add(code);
                else
                    updatedMap.add(code + ":booked");
            } else
                updatedMap.add(entry);
        }

        if (!alreadyBooked.isEmpty())
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Một số ghế đã được đặt: " + String.join(", ", alreadyBooked)
            ));

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

        try {
            booking.setSelectedSeats(objectMapper.writeValueAsString(request.getSelectedSeats()));
        } catch (JsonProcessingException e) {
            // Bạn nên xử lý ngoại lệ này một cách phù hợp,
            // ví dụ: trả về lỗi cho client hoặc ghi log
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi xử lý dữ liệu ghế đã chọn."));
        }

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
                b.getMovie().getId(),
                b.getShowtime().getTheaterName(),
                b.getShowtime().getShowtime().toString(),
                b.getShowtime().getId(),
                b.getQuantity(),
                b.getCreatedAt().toString(),
                b.getSelectedSeats()
        )).toList();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<?> deleteBooking(@PathVariable Long id, Principal principal) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Vé không tồn tại"));
        }

        Booking booking = bookingOpt.get();
        String username = principal.getName();
        if (!booking.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Bạn không có quyền xóa vé này."));
        }

        Showtime showtime = booking.getShowtime();
        String seatMap = showtime.getSeatMap();
        String selectedSeatsJson = booking.getSelectedSeats();

        if (seatMap != null && !seatMap.isBlank() && selectedSeatsJson != null) {
            try {
                // Parse selected seats from JSON
                List<String> selectedSeats = objectMapper.readValue(selectedSeatsJson, new TypeReference<List<String>>() {});

                // Update seat map
                List<String> seatList = Arrays.asList(seatMap.split(","));
                List<String> updatedSeats = new ArrayList<>();

                for (String seat : seatList) {
                    String[] parts = seat.split(":");
                    if (parts.length < 2) {
                        updatedSeats.add(seat);
                        continue;
                    }

                    String seatCode = parts[0];

                    if (selectedSeats.contains(seatCode)) {
                        updatedSeats.add(seatCode + ":available");
                    } else {
                        updatedSeats.add(seat);
                    }
                }

                // Update showtime
                String updatedSeatMap = String.join(",", updatedSeats);
                showtime.setSeatMap(updatedSeatMap);
                showtime.setAvailableSeats(showtime.getAvailableSeats() + booking.getQuantity());
                showtimeRepository.save(showtime);

            } catch (JsonProcessingException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Lỗi khi xử lý dữ liệu ghế ngồi"));
            }
        }

        try {
            bookingRepository.delete(booking);
            return ResponseEntity.ok(Map.of("message", "Xóa vé thành công"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Không thể xóa vé do ràng buộc dữ liệu."));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vé không tồn tại"));

        Optional<Showtime> optionalShowtime = showtimeRepository.findById(request.getShowtimeId());
        if (optionalShowtime.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Suất chiếu không tồn tại."));

        if (request.getSelectedSeats().size() != request.getQuantity())
            return ResponseEntity.badRequest().body(Map.of("error", "Số ghế được chọn phải bằng số lượng vé."));

        // Release seats from old showtime
        Showtime oldShowtime = booking.getShowtime();
        String oldSeatMap = oldShowtime.getSeatMap();
        if (oldSeatMap != null && !oldSeatMap.isBlank() && booking.getSelectedSeats() != null) {
            List<String> selectedSeats;
            try {
                selectedSeats = objectMapper.readValue(booking.getSelectedSeats(), new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Lỗi khi phân tích selectedSeats: " + e.getMessage());
            }

            List<String> oldSeatList = new ArrayList<>(Arrays.asList(oldSeatMap.split(",")));
            List<String> updatedOldMap = oldSeatList.stream()
                    .map(entry -> {
                        String[] parts = entry.split(":");
                        if (parts.length < 2) {
                            return entry + ":available"; // Xử lý trường hợp thiếu status
                        }
                        String code = parts[0];
                        String status = parts[1];
                        return selectedSeats.contains(code) && "booked".equalsIgnoreCase(status) ? code + ":available" : entry;
                    })
                    .collect(Collectors.toList());
            oldShowtime.setSeatMap(String.join(",", updatedOldMap));
            long availableCount = updatedOldMap.stream()
                    .filter(entry -> {
                        String[] parts = entry.split(":");
                        return parts.length > 1 && "available".equalsIgnoreCase(parts[1]);
                    })
                    .count();
            oldShowtime.setAvailableSeats((int) availableCount);
            showtimeRepository.save(oldShowtime);
        }

        Showtime newShowtime = optionalShowtime.get();
        String newSeatMap = newShowtime.getSeatMap();
        if (newSeatMap == null || newSeatMap.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Không có sơ đồ ghế."));

        List<String> newSeatList = new ArrayList<>(Arrays.asList(newSeatMap.split(",")));
        Set<String> selectedSeats = new HashSet<>(request.getSelectedSeats());
        List<String> updatedNewMap = new ArrayList<>();
        Set<String> alreadyBooked = new HashSet<>();

        for (String entry : newSeatList) {
            String[] parts = entry.split(":");
            if (parts.length < 2) {
                updatedNewMap.add(entry + ":available"); // Xử lý trường hợp thiếu status
                continue;
            }
            String code = parts[0];
            String status = parts[1];

            if (selectedSeats.contains(code)) {
                if ("booked".equalsIgnoreCase(status))
                    alreadyBooked.add(code);
                else
                    updatedNewMap.add(code + ":booked");
            } else
                updatedNewMap.add(entry);
        }

        if (!alreadyBooked.isEmpty())
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Một số ghế đã được đặt: " + String.join(", ", alreadyBooked)
            ));

        newShowtime.setSeatMap(String.join(",", updatedNewMap));
        newShowtime.setAvailableSeats(newShowtime.getAvailableSeats() - request.getSelectedSeats().size());
        showtimeRepository.save(newShowtime);

        booking.setShowtime(newShowtime);
        booking.setQuantity(request.getQuantity());
        try {
            booking.setSelectedSeats(objectMapper.writeValueAsString(request.getSelectedSeats()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi chuyển đổi selectedSeats thành JSON: " + e.getMessage());
        }
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
                b.getMovie().getId(),
                b.getShowtime().getTheaterName(),
                b.getShowtime().getShowtime().toString(),
                b.getShowtime().getId(),
                b.getQuantity(),
                b.getCreatedAt().toString(),
                b.getSelectedSeats()
        );

        return ResponseEntity.ok(response);
    }
}