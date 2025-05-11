package com.CinemaGO.backend.controller;

import java.util.List;
import java.util.Optional;

import com.CinemaGO.backend.entities.Movie;
import com.CinemaGO.backend.entities.Showtime;
import com.CinemaGO.backend.repositories.MovieRepository;
import com.CinemaGO.backend.repositories.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/movies")
public class MovieController {
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ShowtimeRepository showtimeRepository;

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        Optional<Movie> movie = movieRepository.findById(id);
        if (movie.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(movie.get());
    }

    @GetMapping("/{movieId}/showtimes")
    public ResponseEntity<List<Showtime>> getShowtimesByMovieId(@PathVariable Long movieId) {
        List<Showtime> showtime = showtimeRepository.findByMovieId(movieId);
        return ResponseEntity.ok(showtime);
    }

}