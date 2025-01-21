package com.kalyvianakis.estiator.io.service;

import java.util.List;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
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
