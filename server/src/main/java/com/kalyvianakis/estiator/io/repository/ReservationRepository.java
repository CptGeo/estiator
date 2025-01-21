package com.kalyvianakis.estiator.io.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kalyvianakis.estiator.io.model.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {}