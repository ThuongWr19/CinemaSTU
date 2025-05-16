package com.CinemaGO.backend.controller;

import java.util.List;
import java.util.Optional;

import com.CinemaGO.backend.entities.Movie;
import com.CinemaGO.backend.entities.Showtime;
import com.CinemaGO.backend.repositories.MovieRepository;
import com.CinemaGO.backend.repositories.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


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

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(movieRepository.save(movie));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        Movie existing = movieRepository.findById(id).orElseThrow();
        existing.setTitle(movie.getTitle());
        existing.setPoster_url(movie.getPoster_url());
        existing.setTrailer_url(movie.getTrailer_url());
        existing.setDescription(movie.getDescription());
        return ResponseEntity.ok(movieRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        try {
            movieRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xoá phim vì đang có suất chiếu hoặc vé liên quan.");
        }
    }



}