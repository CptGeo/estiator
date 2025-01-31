package com.kalyvianakis.estiator.io.service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.kalyvianakis.estiator.io.enums.ReservationStatus;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.repository.ReservationRepository;

@Service
public class ReservationService implements IReservationService {

  @Autowired
  ReservationRepository reservationRepository;

  @Override
  public Reservation save(Reservation reservation) {
    return reservationRepository.save(reservation);
  }

  @Override
  public List<Reservation> get() {
    return reservationRepository.findAll();
  }

  @Override
  public Reservation get(Long id) throws ResourceNotFoundException {
    return reservationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reservation not found for ID: " + id));
  }

  public Long getCount() {
    return reservationRepository.count();
  }

  public Long getCountByDateLessThanEqual(LocalDate date) {
    return reservationRepository.countByDateLessThanEqual(date);
  }

  @Override
  public void delete(Long id) {
    reservationRepository.deleteById(id);
  }

  @Override
  public Boolean exists(Long id) {
    return reservationRepository.existsById(id);
  }

  @Override
  public Boolean notExists(Long id) {
    return !this.exists(id);
  }

}
