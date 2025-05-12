package com.CinemaGO.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "showtime")
public class Showtime {
    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(name = "theater_name", nullable = false)
    private String theaterName;

    @Column(nullable = false)
    private LocalDateTime showtime;

    @Column(name = "available_seats", nullable = false)
    private int availableSeats;

    @Column(name = "seat_map", columnDefinition = "TEXT")
    private String seatMap; // JSON lưu sơ đồ ghế


}