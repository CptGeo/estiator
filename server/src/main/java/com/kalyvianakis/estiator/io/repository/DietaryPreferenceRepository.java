package com.kalyvianakis.estiator.io.repository;

import com.kalyvianakis.estiator.io.model.DietaryPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietaryPreferenceRepository extends JpaRepository<DietaryPreference, String> {}