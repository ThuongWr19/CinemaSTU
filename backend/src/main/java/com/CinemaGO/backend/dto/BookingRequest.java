package com.CinemaGO.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Long movieId;
    private Long showtimeId;
    private int quantity;
    private List<String> selectedSeats;
}
