package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Schedule;
import com.kalyvianakis.estiator.io.model.User;

import java.util.List;

public interface IScheduleService {
    public Schedule save(Schedule resource);
    public List<Schedule> get();
    public Schedule get(Long id) throws ResourceNotFoundException;
    public void delete(Long id);
    public Boolean exists(Long id);
    public Boolean notExists(Long id);
}
