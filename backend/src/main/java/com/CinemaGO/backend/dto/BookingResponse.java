package com.CinemaGO.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingResponse {
<<<<<<< HEAD
    private Long id;
=======
>>>>>>> a31a7b4b4e5f92ce23ebe327a4f9d5a9e4e6527d
    private String bookingCode;
    private String username;
    private String movieTitle;
    private String theaterName;
<<<<<<< HEAD
    private String showtime; // ISO string
    private int quantity;
    private String createdAt;
}
=======
    private String showtime; // ISO string format
    private int quantity;
}
>>>>>>> a31a7b4b4e5f92ce23ebe327a4f9d5a9e4e6527d
