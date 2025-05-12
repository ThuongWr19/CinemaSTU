package com.CinemaGO.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingResponse {
    private String bookingCode;
    private String username;
    private String movieTitle;
    private String theaterName;
    private String showtime; // ISO string format
    private int quantity;
}
