package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Schedule;
import com.kalyvianakis.estiator.io.model.User;

import java.util.List;

public interface IScheduleService {
    public Schedule save(Schedule resource);
    public List<Schedule> get();
    public Schedule get(Integer id) throws ResourceNotFoundException;
    public void delete(Integer id);
    public Boolean exists(Integer id);
    public Boolean notExists(Integer id);
}
