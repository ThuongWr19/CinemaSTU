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
    private String theaterName;
    private String showtime; // ISO string
    private int quantity;
    private String createdAt;
}