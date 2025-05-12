package com.CinemaGO.backend.repositories;

import com.CinemaGO.backend.entities.Booking;
import com.CinemaGO.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
}