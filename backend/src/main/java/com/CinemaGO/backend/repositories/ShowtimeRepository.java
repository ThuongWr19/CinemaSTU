package com.CinemaGO.backend.repositories;

import com.CinemaGO.backend.entities.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovieId(Long movieId); // Tìm tất cả các suất chiếu theo movieId
}