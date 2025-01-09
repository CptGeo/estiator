package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.model.Schedule;
import com.kalyvianakis.estiator.io.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService implements IScheduleService {

  @Autowired
  ScheduleRepository scheduleRepository;

  @Override
  public Schedule save(Schedule reservation) {
    return scheduleRepository.save(reservation);
  }

  @Override
  public List<Schedule> get() {
    return scheduleRepository.findAll();
  }

  @Override
  public Schedule get(Integer id) throws ResourceNotFoundException {
    return scheduleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Schedule not found for ID: " + id));
  }

  @Override
  public void delete(Integer id) {
    scheduleRepository.deleteById(id);
  }

  @Override
  public Boolean exists(Integer id) {
    return scheduleRepository.existsById(id);
  }

  @Override
  public Boolean notExists(Integer id) {
    return !this.exists(id);
  }

}
