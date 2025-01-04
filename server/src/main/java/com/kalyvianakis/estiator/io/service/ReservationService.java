package com.kalyvianakis.estiator.io.service;

import java.util.List;

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
  public Reservation get(Integer id) {
    return reservationRepository.findById(id).orElse(null);
  }

  @Override
  public void delete(Integer id) {
    reservationRepository.deleteById(id);
  }

  @Override
  public boolean exists(Integer id) {
    return reservationRepository.existsById(id);
  }

  @Override
  public boolean notExists(Integer id) {
    return !this.exists(id);
  }

}
