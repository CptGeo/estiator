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
            System.out.println(table.getX());
            System.out.println(table.getLabel());
            tableService.save(table);
        } catch (Error e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } 
        return ResponseEntity.status(HttpStatus.OK).body("Table has been added successfully");
    }

    @GetMapping("/{id}")
    public Table get(@PathVariable Integer id) {
        return tableService.get(id);
    }

    @GetMapping()
    public List<Table> get() {
        return tableService.get();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        tableService.delete(id);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<Table> patch(@PathVariable Integer id, @RequestBody Table table) {
        Table current = tableService.get(id);

        tablePatcher.patch(current, table); 
        tableService.save(current);

        return ResponseEntity.status(HttpStatus.OK).body(current);
    }
}
