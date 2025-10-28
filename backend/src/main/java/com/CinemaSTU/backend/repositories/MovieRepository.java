package com.CinemaSTU.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CinemaSTU.backend.entities.Movie;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
}
