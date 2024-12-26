package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.component.patcher.TablePatcher;
import com.kalyvianakis.estiator.io.model.Table;
import com.kalyvianakis.estiator.io.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/tables")
public class TableController {
    @Autowired
    private TableService tableService;
    
    @Autowired 
    private TablePatcher tablePatcher;

    @PostMapping
    // @todo - Fix issue with entity creation. Instead of 400 - Bad Request, I get 500 - Internal Server Error after data validation with 'false' result
    public ResponseEntity<String> add(@RequestBody Table table) {
        try {
            tableService.save(table);
            return ResponseEntity.ok().body("Table has been added successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Integer id) {
        try{ 
            Table table = tableService.get(id);
            if (table == null) {
                return ResponseEntity.badRequest().body("Resource not found for ID: " + id);
            }
            return ResponseEntity.ok().body(table);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping()
    public ResponseEntity<List<Table>> get() {
        return ResponseEntity.ok().body(tableService.get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        try {
            if(tableService.notExists(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found for ID: " + id);
            }
            
            tableService.delete(id);
            return ResponseEntity.ok().body(String.format("Resource deleted for ID: ", id)); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Integer id, @RequestBody Table table) {
        try {
            if (id == null || id < 0) {
                return ResponseEntity.badRequest().body("Invalid ID provided");
            }

            Table current = tableService.get(id);

            if(current == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resource not found for ID: " + id);
            }

            tablePatcher.patch(current, table); 
            tableService.save(current);

            return ResponseEntity.ok().body(current);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}
