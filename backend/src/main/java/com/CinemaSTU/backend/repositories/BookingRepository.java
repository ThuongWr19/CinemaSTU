package com.CinemaSTU.backend.repositories;

import com.CinemaSTU.backend.entities.Booking;
import com.CinemaSTU.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
}