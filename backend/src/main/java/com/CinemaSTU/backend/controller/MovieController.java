package com.CinemaSTU.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.CinemaSTU.backend.entities.Movie;
import com.CinemaSTU.backend.entities.Showtime;
import com.CinemaSTU.backend.repositories.MovieRepository;
import com.CinemaSTU.backend.repositories.ShowtimeRepository;
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
    public ResponseEntity<?> createMovie(@RequestBody Movie movie) {
        Movie savedMovie = movieRepository.save(movie);

        // Tạo các suất chiếu mặc định
        String[] theaters = {"Rạp 1", "Rạp 2"};
        LocalDateTime[] showtimes = {
                LocalDateTime.now().plusDays(1).withHour(14).withMinute(0).withSecond(0),
                LocalDateTime.now().plusDays(1).withHour(17).withMinute(0).withSecond(0),
                LocalDateTime.now().plusDays(1).withHour(20).withMinute(0).withSecond(0)
        };

        for (String theater : theaters) {
            for (LocalDateTime showtimeDate : showtimes) {
                Showtime showtime = new Showtime();
                showtime.setMovie(savedMovie);
                showtime.setTheaterName(theater);
                showtime.setShowtime(showtimeDate);
                showtime.setSeatMap(generateDefaultSeatMap());
                int seatCount = (int) showtime.getSeatMap().chars().filter(c -> c == ':').count();
                showtime.setAvailableSeats(seatCount);
                showtimeRepository.save(showtime);
            }
        }

        return ResponseEntity.ok(savedMovie);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        Movie existing = movieRepository.findById(id).orElseThrow();
        existing.setTitle(movie.getTitle());
        existing.setPoster_url(movie.getPoster_url());
        existing.setTrailer_url(movie.getTrailer_url());
        existing.setDescription(movie.getDescription());
        existing.setActors(movie.getActors());
        existing.setDirector(movie.getDirector());
        existing.setCountry(movie.getCountry());
        existing.setDuration(movie.getDuration());
        existing.setRating(movie.getRating());
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

    private String generateDefaultSeatMap() {
        StringBuilder sb = new StringBuilder();
        char[] rows = {'A', 'B', 'C', 'D'};
        int seatsPerRow = 20;

        for (char row : rows) {
            for (int i = 1; i <= seatsPerRow; i++) {
                sb.append(row).append(i).append(":available,");
            }
        }

        if (!sb.isEmpty()) {
            sb.setLength(sb.length() - 1);
        }

        return sb.toString();
    }
}