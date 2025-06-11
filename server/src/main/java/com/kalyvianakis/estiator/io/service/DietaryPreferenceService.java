package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.model.DietaryPreference;
import com.kalyvianakis.estiator.io.repository.DietaryPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DietaryPreferenceService implements IDietaryPreferenceService {

  @Autowired
  DietaryPreferenceRepository dietaryPreferenceRepository;

  @Override
  public DietaryPreference save(DietaryPreference dietaryPreference) {
    return dietaryPreferenceRepository.save(dietaryPreference);
  }

  public void saveAll(List<DietaryPreference> dietaryPreferences) {
    dietaryPreferenceRepository.saveAll(dietaryPreferences);
  }

  public Optional<DietaryPreference> findById(String id) {
    return dietaryPreferenceRepository.findById(id);
  }

  public List<DietaryPreference> findAll() {
    return dietaryPreferenceRepository.findAll();
  }

  public Boolean exists(String id) {
    return dietaryPreferenceRepository.existsById(id);
  }
}
