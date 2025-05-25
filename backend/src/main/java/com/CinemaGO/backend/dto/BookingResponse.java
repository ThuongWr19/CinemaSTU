package com.CinemaGO.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingCode;
    private String username;
    private String movieTitle;
    private Long movieId;
    private String theaterName;
    private String showtime;
    private Long showtimeId;
    private Integer quantity;
    private String createdAt;
    private String selectedSeats;
}