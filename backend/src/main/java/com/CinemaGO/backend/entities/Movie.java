package com.CinemaGO.backend.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

enum STATUS {
    COMING_SOON,
    NOW_SHOWING,
    STOPPED
}

@Getter
@Setter
@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Date release_date;
    private String poster_url;
    private String trailer_url;

    @Enumerated(EnumType.STRING)
    private STATUS status;

}
