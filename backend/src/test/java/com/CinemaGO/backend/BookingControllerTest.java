package com.CinemaGO.backend;

import com.CinemaGO.backend.controller.BookingController;
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
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingControllerTest {

    @InjectMocks
    private BookingController bookingController;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private UserRepository userRepository;

    private User user;
    private Movie movie;
    private Showtime showtime;
    private BookingRequest bookingRequest;

    @BeforeEach
    void setUp() throws NoSuchFieldException, IllegalAccessException {
        MockitoAnnotations.openMocks(this);

        // Sử dụng reflection để gán ObjectMapper
        Field objectMapperField = BookingController.class.getDeclaredField("objectMapper");
        objectMapperField.setAccessible(true); // Cho phép truy cập trường private
        objectMapperField.set(bookingController, new ObjectMapper());

        user = new User();
        user.setUsername("testuser");

        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Test Movie");

        showtime = new Showtime();
        showtime.setId(1L);
        showtime.setSeatMap("A1:available,A2:available,A3:booked"); // Thêm ghế trống A1 và A2
        showtime.setAvailableSeats(2); // Có 2 ghế trống
        showtime.setShowtime(LocalDateTime.now());
        showtime.setTheaterName("Test Theater");

        bookingRequest = new BookingRequest();
        bookingRequest.setMovieId(1L);
        bookingRequest.setShowtimeId(1L);
        bookingRequest.setQuantity(2);
        bookingRequest.setSelectedSeats(Arrays.asList("A1", "A2"));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("testuser", null)
        );
    }

    @Test
    void bookTickets_Success() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(showtimeRepository.findById(1L)).thenReturn(Optional.of(showtime));
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(1L);
            return booking;
        });
        when(showtimeRepository.save(any(Showtime.class))).thenAnswer(invocation -> {
            Showtime updatedShowtime = invocation.getArgument(0);
            // Cập nhật seatMap và availableSeats sau khi đặt A1 và A2
            updatedShowtime.setSeatMap("A1:booked,A2:booked,A3:booked");
            updatedShowtime.setAvailableSeats(0);
            return updatedShowtime;
        });

        ResponseEntity<?> response = bookingController.bookTickets(bookingRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Đặt vé thành công", responseBody.get("message"));
        assertTrue(responseBody.get("bookingCode").startsWith("BK"));

        verify(showtimeRepository).save(showtime);
        verify(bookingRepository).save(any(Booking.class));
        assertEquals("A1:booked,A2:booked,A3:booked", showtime.getSeatMap());
        assertEquals(0, showtime.getAvailableSeats());
    }

    @Test
    void bookTickets_MovieNotFound() {
        when(movieRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = bookingController.bookTickets(bookingRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Phim hoặc suất chiếu không tồn tại.", responseBody.get("error"));

        verify(bookingRepository, never()).save(any());
    }

    @Test
    void bookTickets_SeatAlreadyBooked() {
        bookingRequest.setSelectedSeats(Arrays.asList("A3"));
        bookingRequest.setQuantity(1);

        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(showtimeRepository.findById(1L)).thenReturn(Optional.of(showtime));

        ResponseEntity<?> response = bookingController.bookTickets(bookingRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Một số ghế đã được đặt: A3", responseBody.get("error"));

        verify(bookingRepository, never()).save(any());
    }

    @Test
    void bookTickets_QuantityMismatch() {
        bookingRequest.setQuantity(1);
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(showtimeRepository.findById(1L)).thenReturn(Optional.of(showtime));

        ResponseEntity<?> response = bookingController.bookTickets(bookingRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Số ghế được chọn phải bằng số lượng vé.", responseBody.get("error"));

        verify(bookingRepository, never()).save(any());
    }

    @Test
    void getMyBookings_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        List<Booking> bookings = Arrays.asList(new Booking());
        when(bookingRepository.findByUser(user)).thenReturn(bookings);

        ResponseEntity<?> response = bookingController.getMyBookings();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(bookings, response.getBody());
    }

    @Test
    void getAllBookings_Success() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setBookingCode("BK123");
        booking.setUser(user);
        booking.setMovie(movie);
        booking.setShowtime(showtime);
        booking.setQuantity(2);
        booking.setCreatedAt(LocalDateTime.now());

        when(bookingRepository.findAll()).thenReturn(Arrays.asList(booking));

        ResponseEntity<?> response = bookingController.getAllBookings();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<BookingResponse> result = (List<BookingResponse>) response.getBody();
        assertEquals(1, result.size());
        assertEquals("BK123", result.get(0).getBookingCode());
    }

    @Test
    void deleteBooking_Success() {
        showtime.setSeatMap("A1:booked,A2:booked,A3:booked,A4:available");
        showtime.setAvailableSeats(1);

        Booking booking = new Booking();
        booking.setId(1L);
        booking.setShowtime(showtime);
        booking.setQuantity(2);
        // Set selectedSeats to match the seats that were booked
        booking.setSelectedSeats("[\"A1\", \"A2\"]");

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(showtimeRepository.save(any(Showtime.class))).thenReturn(showtime);

        ResponseEntity<?> response = bookingController.deleteBooking(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Xóa vé thành công", responseBody.get("message"));

        verify(bookingRepository).deleteById(1L);
        verify(showtimeRepository).save(showtime);
        // Update expected seatMap and availableSeats
        assertEquals("A1:available,A2:available,A3:booked,A4:available", showtime.getSeatMap());
        assertEquals(3, showtime.getAvailableSeats()); // 1 (A4) + 2 (A1, A2) = 3
    }


    @Test
    void updateBooking_Success() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setShowtime(showtime);
        booking.setQuantity(2);
        // Thiết lập selectedSeats để khớp với các ghế đã đặt
        booking.setSelectedSeats("[\"A1\",\"A2\"]");

        Showtime newShowtime = new Showtime();
        newShowtime.setId(2L);
        newShowtime.setSeatMap("B1:available,B2:available");
        newShowtime.setAvailableSeats(2);

        bookingRequest.setShowtimeId(2L);
        bookingRequest.setSelectedSeats(Arrays.asList("B1", "B2"));

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(showtimeRepository.findById(2L)).thenReturn(Optional.of(newShowtime));
        when(showtimeRepository.save(any(Showtime.class))).thenReturn(newShowtime);
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        ResponseEntity<?> response = bookingController.updateBooking(1L, bookingRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Cập nhật vé thành công", responseBody.get("message"));

        verify(showtimeRepository, times(2)).save(any(Showtime.class));
        verify(bookingRepository).save(booking);
        assertEquals("B1:booked,B2:booked", newShowtime.getSeatMap());
        assertEquals(0, newShowtime.getAvailableSeats());
        assertEquals("A1:available,A2:available,A3:booked", showtime.getSeatMap());
        assertEquals(2, showtime.getAvailableSeats());
    }

    @Test
    void getBookingById_Success() {
        LocalDateTime now = LocalDateTime.now();
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setBookingCode("BK123");
        booking.setUser(user);
        booking.setMovie(movie);
        booking.setShowtime(showtime);
        booking.setQuantity(2);
        booking.setCreatedAt(now);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        ResponseEntity<BookingResponse> response = bookingController.getBookingById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        BookingResponse result = response.getBody();
        assertEquals("BK123", result.getBookingCode());
        assertEquals("testuser", result.getUsername());
        assertEquals("Test Movie", result.getMovieTitle());
        assertEquals("Test Theater", result.getTheaterName());
        assertEquals(2, result.getQuantity());
        assertEquals(showtime.getShowtime(), LocalDateTime.parse(result.getShowtime(), DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        assertEquals(now, LocalDateTime.parse(result.getCreatedAt(), DateTimeFormatter.ISO_LOCAL_DATE_TIME));
    }
}