package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.global.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Table;

import java.util.List;

public interface ITableService {
    public Table save(Table table);
    public List<Table> get();
    public Table get(Integer id) throws ResourceNotFoundException;
    public void delete(Integer id) throws ResourceNotFoundException;
    public Boolean exists(int id);
    public Boolean notExists(int id);
}