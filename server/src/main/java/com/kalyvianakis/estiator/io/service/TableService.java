package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.model.Table;
import com.kalyvianakis.estiator.io.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class TableService implements ITableService {

    @Autowired
    private TableRepository tableRepository;

    @Override
    public Table save(Table table) {
        return tableRepository.save(table);
    }

    @Override
    public List<Table> get() {
        return tableRepository.findAll();
    }

    @Override
    public Table get(int id) {
        return tableRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(int id) {
        tableRepository.deleteById(id);
    }
}