package com.kalyvianakis.estiator.io.service;

import java.util.List;

import com.kalyvianakis.estiator.io.model.Reservation;

public interface IReservationService {
  public Reservation save(Reservation reservation);
  public List<Reservation> get();
  public Reservation get(Integer id);
  public void delete(Integer id);
  public boolean exists(Integer id);
  public boolean notExists(Integer id);
}
