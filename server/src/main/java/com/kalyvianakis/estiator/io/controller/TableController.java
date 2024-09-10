package com.kalyvianakis.estiator.io.controller;

import com.kalyvianakis.estiator.io.model.Table;
import com.kalyvianakis.estiator.io.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tables")
public class TableController {
    @Autowired
    private TableService tableService;

    @PostMapping("/add")
    public String add(@RequestBody Table table) {
        tableService.save(table);
        return "Table has been added successfully";
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
}
