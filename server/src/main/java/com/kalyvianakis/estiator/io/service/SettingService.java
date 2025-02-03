package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.model.Reservation;
import com.kalyvianakis.estiator.io.model.Setting;
import com.kalyvianakis.estiator.io.repository.ReservationRepository;
import com.kalyvianakis.estiator.io.repository.SettingRepository;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SettingService implements ISettingService {

  @Autowired
  SettingRepository settingRepository;

  @Override
  public Setting save(Setting setting) {
    return settingRepository.save(setting);
  }

  public void saveAll(List<Setting> settings) {
    settingRepository.saveAll(settings);
  }

  public Optional<Setting> findById(String id) {
    return settingRepository.findById(id);
  }

  public List<Setting> findAll() {
    return settingRepository.findAll();
  }

  public Boolean exists(String id) {
    return settingRepository.existsById(id);
  }
}
