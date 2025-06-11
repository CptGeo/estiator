package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.model.DietaryPreference;
import com.kalyvianakis.estiator.io.model.Setting;
import com.kalyvianakis.estiator.io.service.DietaryPreferenceService;
import com.kalyvianakis.estiator.io.service.SettingService;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("dietaryPreferences")
public class DietaryPreferenceController {

    @Autowired
    DietaryPreferenceService dietaryPreferenceService;

    @GetMapping
    public ResponseEntity<List<DietaryPreference>> get() {
        List<DietaryPreference> dietaryPreferences = dietaryPreferenceService.findAll();
        return ResponseEntity.ok().body(dietaryPreferences);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DietaryPreference> get(@PathVariable(name = "id") String id) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(dietaryPreferenceService.findById(id).orElseThrow(() -> new ResourceNotFoundException("DietaryPreference not found for ID: " + id)));
    }
}
