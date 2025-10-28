package com.CinemaSTU.backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
public class BookingRequest {
    private Long movieId;
    private Long showtimeId;
    private int quantity;
    private List<String> selectedSeats;
}
