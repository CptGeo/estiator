package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.model.Setting;
import com.kalyvianakis.estiator.io.service.SettingService;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("settings")
public class SettingController {

    @Autowired
    SettingService settingService;

    @GetMapping
    public ResponseEntity<Map<String, String>> get() {
        List<Setting> settings = settingService.findAll();
        HashMap<String, String> json = new HashMap<>();
        settings.forEach(setting -> {
            json.put(setting.getId(), setting.getValue());
        });
        return ResponseEntity.ok().body(json);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Setting> get(@PathVariable(name = "id") String id) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(settingService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Setting not found for ID: " + id)));
    }

    @PatchMapping()
    public ResponseEntity<ResponseEntity.BodyBuilder> patch(@RequestBody Map<String, String> data) throws ResourceNotFoundException {
        List<Setting> settings = new ArrayList<>();
        for(Map.Entry<String, String> entry: data.entrySet()) {
            if (!settingService.exists(entry.getKey())) {
                throw new ResourceNotFoundException("Setting not found for ID: " + entry.getKey());
            }
            Setting setting = new Setting();
            setting.setId(entry.getKey());
            setting.setValue(entry.getValue());
            settings.add(setting);
        }

        settingService.saveAll(settings);

        return ResponseEntity.ok().build();
    }
}
