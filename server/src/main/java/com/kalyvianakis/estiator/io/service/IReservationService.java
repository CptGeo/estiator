package com.kalyvianakis.estiator.io.service;

import java.util.List;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Reservation;

public interface IReservationService {
  public Reservation save(Reservation reservation);
  public List<Reservation> get();
  public Reservation get(Long id) throws ResourceNotFoundException;
  public void delete(Long id);
  public Boolean exists(Long id);
  public Boolean notExists(Long id);
}
