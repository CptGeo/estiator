package com.kalyvianakis.estiator.io.service;

import com.kalyvianakis.estiator.io.utils.ResourceNotFoundException;
import com.kalyvianakis.estiator.io.model.Table;

import java.util.List;

public interface ITableService {
    public Table save(Table table);
    public List<Table> get();
    public Table get(Long id) throws ResourceNotFoundException;
    public void delete(Long id) throws ResourceNotFoundException;
    public Boolean exists(Long id);
    public Boolean notExists(Long id);
}