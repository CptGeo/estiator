package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.component.patcher.SchedulePatcher;
import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.MessageResponse;
import com.kalyvianakis.estiator.io.model.Schedule;
import com.kalyvianakis.estiator.io.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("schedules")
@SuppressWarnings("unused")
public class ScheduleController {
    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private SchedulePatcher schedulePatcher;

    @PostMapping
    public ResponseEntity<Schedule> add(@RequestBody Schedule schedule) {
        return ResponseEntity.ok().body(scheduleService.save(schedule));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(scheduleService.get(id));
    }

    @GetMapping()
    public ResponseEntity<List<Schedule>> get() {
        return ResponseEntity.ok().body(scheduleService.get());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws ResourceNotFoundException, IllegalArgumentException {
        if(scheduleService.notExists(id)) {
            throw new ResourceNotFoundException("Resource not found for ID: " + id);
        }

        scheduleService.delete(id);
        MessageResponse response = new MessageResponse("Resource deleted for ID: " + id);
        return ResponseEntity.ok().body(response);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody Schedule schedule) throws ResourceNotFoundException, IllegalArgumentException {
        Schedule current = scheduleService.get(id);

        schedulePatcher.patch(current, schedule);
        scheduleService.save(current);

        return ResponseEntity.ok().body(current);
    }
}
