package com.kalyvianakis.estiator.io.service;

import java.util.List;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Reservation;

public interface IReservationService {
  public Reservation save(Reservation reservation);
  public List<Reservation> get();
  public Reservation get(Integer id) throws ResourceNotFoundException;
  public void delete(Integer id);
  public Boolean exists(Integer id);
  public Boolean notExists(Integer id);
}
