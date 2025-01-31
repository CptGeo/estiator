package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kalyvianakis.estiator.io.model.Reservation;

import java.sql.Date;
import java.time.LocalDate;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Long countByDateLessThanEqual(LocalDate date);
}