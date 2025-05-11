package com.CinemaGO.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CinemaGO.backend.entities.Movie;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

}
