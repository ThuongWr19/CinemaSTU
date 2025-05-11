package com.CinemaGO.backend.repositories;

import com.CinemaGO.backend.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Thêm các phương thức tùy chỉnh nếu cần
}