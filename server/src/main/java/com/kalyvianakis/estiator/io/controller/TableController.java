package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.component.patcher.TablePatcher;
import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.MessageResponse;
import com.kalyvianakis.estiator.io.model.Table;
import com.kalyvianakis.estiator.io.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("tables")
@SuppressWarnings("unused")
public class TableController {
    @Autowired
    private TableService tableService;
    
    @Autowired 
    private TablePatcher tablePatcher;

    @PostMapping
    public ResponseEntity<Table> add(@RequestBody Table table) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tableService.save(table));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Table> get(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok().body(tableService.get(id));
    }

    @GetMapping()
    public ResponseEntity<?> get(
            @RequestParam(name = "count", required = false) Boolean count,
            @RequestParam(name = "capacity", required = false) Boolean capacity,
            @RequestParam(name = "date", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd", iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(name = "time", required = false) @DateTimeFormat(pattern = "HH:mm", iso = DateTimeFormat.ISO.TIME) LocalTime time,
            @RequestParam(name = "duration", required = false) Integer duration
    ) {
        if (count != null && count) {
            return ResponseEntity.ok().body(tableService.count());
        }

        if (capacity != null && capacity) {
            return ResponseEntity.ok().body(tableService.getTotalCapacity());
        }

        if (date != null && time != null && duration != null) {
            return ResponseEntity.ok().body(tableService.getIdsFreeByDateAndTimeAndDuration(date, time, duration));
        }

        return ResponseEntity.ok().body(tableService.get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws ResourceNotFoundException {
        if(tableService.notExists(id)) {
            throw new ResourceNotFoundException("Table not found for ID: " + id);
        }

        tableService.delete(id);
        MessageResponse response = new MessageResponse("Table deleted for ID: " + id, "");
        return ResponseEntity.ok().body(response);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody Table table) throws ResourceNotFoundException, IllegalArgumentException {
        Table current = tableService.get(id);

        tablePatcher.patch(current, table);
        tableService.save(current);

        return ResponseEntity.ok().body(current);
    }
}
